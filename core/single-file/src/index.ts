import * as cheerio from "cheerio";
import { cli } from "cleye";
import dedent from "dedent";
import he from "he";
import ky, { type KyResponse } from "ky";
import * as fs from "node:fs";
import * as path from "node:path";
import { createDebug, enable } from "obug";
import * as oxc from "oxc-parser";

const html = dedent;

const BASE_DEBUG_NAMESPACE = "single-file" as const;
const DEBUG_NAMESPACES = ["info", "warn", "error"] as const;
type DEBUG_NAMESPACE = (typeof DEBUG_NAMESPACES)[number];
type DEBUG_SCOPE = `${typeof BASE_DEBUG_NAMESPACE}:${DEBUG_NAMESPACE}`;

const debug = createDebug(BASE_DEBUG_NAMESPACE, {
	color: 2,
	log: console.info,
	useColors: true,
});

const [debugInfo, debugWarn, debugError] = DEBUG_NAMESPACES.map((namespace) => {
	return debug.extend(namespace);
});

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

	enableDebug("single-file:warn");
	enableDebug("single-file:error");

	if (argv.flags.verbose) {
		enableDebug("single-file:info");
		debugInfo.log("enabled debug info");
	}

	const pageResponse = await ky.get(argv._.url);

	debugInfo.log(`loading ${argv._.url}`);

	if (!pageResponse?.headers?.get("Content-Type")?.includes("text/html")) {
		throw new Error(
			`requested url \`${argv._.url}\` must be an html page.`,
		);
	}

	const page = await pageResponse.text();

	const $ = cheerio.load(page);

	for (const svgUse of $("use[href]")) {
		debugInfo.log(`loading \`svg>use\` ${svgUse.attribs.href}`);

		const src = isUrl(svgUse.attribs.href, argv._.url);
		if (!src) continue;

		const response = await ky.get(src);
		const svgMap = await response.text();
		const $$ = cheerio.load(svgMap, { xmlMode: true });
		const [_, hash] = svgUse.attribs.href.split("#");
		if (!hash) return null;

		const symbol = $$(`symbol#${hash}`);
		const viewBox = symbol.attr("viewBox") || "0 0 24 24";
		const inner = symbol.html();
		if (!inner) {
			throw new Error("unable to parse parent");
		}

		$(svgUse).parent().attr("viewBox", viewBox);
		$(svgUse).replaceWith(inner);
	}

	for (const img of $("img[src]")) {
		debugInfo.log(`loading \`img\` ${img.attribs.src}`);

		const src = isUrl(img.attribs.src, argv._.url);
		if (!src) continue;

		const response = await ky.get(src);
		const extension = img.attribs.src
			.split(".")
			.at(-1)
			?.replace(/#.*/, "")
			.replace(/\?.*/, "");

		switch (extension) {
			case "svg": {
				if (img.attribs.src.includes("#")) {
					const svgMap = await response.text();
					const $$ = cheerio.load(svgMap, { xmlMode: true });
					const [_, hash] = img.attribs.src.split("#");
					if (!hash) return null;

					const symbol = $$(`symbol#${hash}`);
					const viewBox = symbol.attr("viewBox") || "0 0 24 24";
					const inner = symbol.html();
					const svg = html`
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="${viewBox}"
						>
							${inner}
						</svg>
					`.trim();

					const encoded = encodeURIComponent(svg)
						.replace(/'/g, "%27")
						.replace(/"/g, "%22");

					$(img).attr("src", `data:image/svg+xml,${encoded}`);
				} else {
					const dataUri = await bufferToDataUri(response);
					$(img).attr("src", dataUri);
				}
				break;
			}
			default: {
				const dataUri = await bufferToDataUri(response);
				$(img).attr("src", dataUri);
			}
		}
	}

	for (const link of $("link[href]")) {
		debugInfo.log(`loading \`link\` ${link.attribs.href}`);

		const src = isUrl(link.attribs.href, argv._.url);
		if (!src) continue;

		const response = await ky.get(src);

		switch (link.attribs.rel) {
			case "apple-touch-icon":
			case "icon":
			case "shortcut icon": {
				const dataUri = await bufferToDataUri(response);
				$(link).attr("href", dataUri);
				break;
			}

			case "stylesheet": {
				const linkSrc = await response.text();
				$(link).replaceWith(
					html`<style>
						${linkSrc}
					</style>`,
				);

				break;
			}
		}
	}

	const imported = [];

	for (const script of $("script[src]")) {
		debugInfo.log(`loading \`script\` ${script.attribs.src}`);
		const src = isUrl(script.attribs.src, argv._.url);
		if (!src) continue;

		let scriptSrc = await ky.get(src).text();
		const result = await oxc.parse(src, scriptSrc);
		const dynamicImports = result.module.dynamicImports.map(
			(i) => i.moduleRequest,
		);
		const staticImports = result.module.staticImports.map(
			(i) => i.moduleRequest,
		);
		const imports = [...staticImports];

		const dirname = path.posix.dirname(new URL(src).pathname);
		const allImports = imports
			.filter((i) => i)
			.map((i) => ({ key: i.value, value: dirname + "/" + i.value }));

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

		debugInfo.log(
			`has imports: ${JSON.stringify(allImports, undefined, 2)}`,
		);

		$(script).removeAttr("src");
		$(script).text(scriptSrc);
	}

	const setImports = new Set(imported);
	const importSources: Record<string, string> = {};

	debugInfo.log(
		`found imports ${JSON.stringify([...setImports], undefined, 2)}`,
	);

	for (const current of setImports) {
		if (!current.key) continue;

		importSources[current.key] = await ky
			.get(new URL(current.value, argv._.url))
			.text();
	}

	const registryString = Object.entries(importSources)
		.map(([file, source]) => {
			const escaped = escapeScript(source);
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

async function bufferToDataUri<T = unknown>(res: KyResponse<T>) {
	const buffer = await res.arrayBuffer();
	const mime = res.headers.get("content-type") || "image/png";
	const base64 = Buffer.from(buffer).toString("base64");
	return `data:${mime};base64,${base64}`;
}

function enableDebug(debugScope: DEBUG_SCOPE) {
	enable(debugScope);
}

function escapeScript(script: string) {
	return script
		.replaceAll("\\", "\\\\")
		.replaceAll("`", "\\`")
		.replaceAll("${", "\\${")
		.replaceAll("<script", "<\\x73cript")
		.replaceAll("</script>", "<\\/script>")
		.replaceAll("\n", "\\n") // ← add this
		.replaceAll("\r", "");
}

function isProbablyUrl(str: string) {
	if (!str) return false;

	// reject obvious non-URLs
	if (str.includes("\n") || str.includes("{") || str.includes("function")) {
		return false;
	}

	// allow:
	// - absolute URLs
	// - root-relative (/foo.js)
	// - relative (./foo.js, foo.js)
	return /^(https?:\/\/|\/|\.\/|\.\.\/|[a-zA-Z0-9_\-./]+$)/.test(str);
}

function isUrl(url: string, base: string) {
	if (!isProbablyUrl(url)) return false;
	try {
		return new URL(url, base).href;
	} catch (error) {
		console.error(`${url} is not a URL\n${error}`);
		return false;
	}
}
