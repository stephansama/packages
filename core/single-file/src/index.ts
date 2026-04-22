import * as cheerio from "cheerio";
import { cli } from "cleye";
import he from "he";
import ky from "ky";
import * as fs from "node:fs";
import path from "node:path";
import * as oxc from "oxc-parser";

import * as inline from "./inline";
import * as log from "./log";
import * as utilities from "./utilities";

export async function run() {
	const argv = cli({
		flags: {
			output: {
				alias: "o",
				default: "single-file.html",
				description: "output path for single html file",
				type: String,
			},
			verbose: {
				alias: "v",
				default: false,
				description: "Verbose output",
				type: Boolean,
			},
		},
		name: "single-file",
		parameters: [`<url>`],
	});

	log.enable(argv.flags.verbose);

	const pageResponse = await ky.get(argv._.url);

	log.info(`loading ${argv._.url}`);

	if (!pageResponse?.headers?.get("Content-Type")?.includes("text/html")) {
		throw new Error(
			`requested url \`${argv._.url}\` must be an html page.`,
		);
	}

	const page = await pageResponse.text();

	const $ = cheerio.load(page);

	for (const inlineCallback of Object.values(inline)) {
		await inlineCallback($, argv._.url);
	}

	const imported = [];

	for (const script of $("script[src]")) {
		log.info(`loading \`script\` ${script.attribs.src}`);
		const src = utilities.isUrl(script.attribs.src, argv._.url);
		if (!src) continue;

		let scriptSrc = await ky.get(src).text();
		const result = await oxc.parse(src, scriptSrc);
		const dynamicImports = result.module.dynamicImports.map((current) => {
			return current.moduleRequest;
		});
		const staticImports = result.module.staticImports.map((current) => {
			return current.moduleRequest;
		});
		const imports = [...staticImports];

		const dirname = path.posix.dirname(new URL(src).pathname);
		const allImports = imports
			.filter((i) => i)
			.map((i) => ({ key: i.value, value: path.join(dirname, i.value) }));

		imported.push(...allImports);

		for (const current of imports) {
			const escaped = current.value.replace(
				/[.*+?^${}()|[\]\\]/g,
				"\\$&",
			);

			const importRegex = new RegExp(`import\\s*['"]${escaped}['"]`, "g");
			const fromRegex = new RegExp(`from\\s*['"]${escaped}['"]`, "g");

			scriptSrc = scriptSrc.replaceAll(
				importRegex,
				`await import(window.registry["${current.value}"])`,
			);

			scriptSrc = scriptSrc.replaceAll(
				fromRegex,
				`= await import(window.registry["${current.value}"])`,
			);
		}

		// Move this OUTSIDE and BEFORE the for loop
		scriptSrc = scriptSrc.replace(/\bimport(?!\s*\()/g, "const");

		log.info(`has imports: ${JSON.stringify(allImports, undefined, 2)}`);

		$(script).removeAttr("src");
		$(script).text(scriptSrc);
	}

	const setImports = new Set(imported);
	const importSources: Record<string, string> = {};

	log.info(`found imports ${JSON.stringify([...setImports], undefined, 2)}`);

	for (const current of setImports) {
		if (!current.key) continue;

		importSources[current.key] = await ky
			.get(new URL(current.value, argv._.url))
			.text();
	}

	const registryString = Object.entries(importSources)
		.map(([file, source]) => {
			const escaped = utilities.escapeScript(source);
			return (
				'"' +
				file +
				'": URL.createObjectURL(new Blob([`' +
				escaped +
				"`], {type: 'text/javascript'}))"
			);
		})
		.join(",\n");

	const registryScript = `<script type="module">\nwindow.registry = {\n${registryString}\n};\n</script>`;

	const updatedContent = $.html()
		?.replace("<head>", `<head>${registryScript}`)
		.replace(
			/<script((?![^>]*\bsrc\b)[^>]*)>([\s\S]*?)<\/script>/g,
			(match, attrs, content) => {
				if (attrs.includes("application/ld+json")) return match;
				if (content.includes("window.registry")) return match;
				const decoded = he.decode(content);
				return `<script${attrs}>${decoded}</script>`;
			},
		);

	if (!updatedContent) {
		throw new Error("unable to generate head content");
	}

	await fs.promises.writeFile(argv.flags.output, updatedContent, "utf8");
}
