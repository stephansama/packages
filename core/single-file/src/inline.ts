import * as cheerio from "cheerio";
import dedent from "dedent";
import path from "node:path";
import * as oxc from "oxc-parser";

import * as importMap from "./import-map";
import * as log from "./log";
import * as utilities from "./utilities";

export type InlineFunction = (
	$: cheerio.CheerioAPI,
	baseUrl: string,
) => Promise<void>;

const html = dedent;
const js = dedent;

const regexes = {
	id: /#.*/,
	queryParameters: /\?.*/,
};

export const img: InlineFunction = async ($, baseUrl) => {
	for (const img of $("img[src]")) {
		log.info(`loading \`img\` ${img.attribs.src}`);

		const source = utilities.isUrl(img.attribs.src, baseUrl);
		if (!source) continue;

		const importedImage = await importMap.loadImport({
			file: source,
			isBinary: true,
		});
		const extension = img.attribs.src
			.split(".")
			.at(-1)
			?.replace(regexes.id, "")
			.replace(regexes.queryParameters, "");

		switch (extension) {
			case "svg": {
				if (img.attribs.src.includes("#")) {
					const $$ = cheerio.load(Buffer.from(importedImage), {
						xmlMode: true,
					});
					const [_, hash] = img.attribs.src.split("#");
					if (!hash) continue;

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
						.replaceAll("'", "%27")
						.replaceAll('"', "%22");

					$(img).attr("src", `data:image/svg+xml,${encoded}`);
					break;
				} else {
					const dataUri = utilities.bufferToDataUri(
						importedImage,
						importMap.imports.get(source)?.contentType,
					);
					$(img).attr("src", dataUri);
				}
				break;
			}
			default: {
				const dataUri = utilities.bufferToDataUri(
					importedImage,
					importMap.imports.get(source)?.contentType,
				);
				$(img).attr("src", dataUri);
			}
		}
	}
};

export const link: InlineFunction = async ($, baseUrl) => {
	for (const link of $("link[href]")) {
		log.info(`loading \`link\` ${link.attribs.href}`);

		const source = utilities.isUrl(link.attribs.href, baseUrl);
		if (!source) continue;

		switch (link.attribs.rel) {
			case "apple-touch-icon":
			case "icon":
			case "shortcut icon": {
				const buffer = await importMap.loadImport({
					file: source,
					isBinary: true,
				});
				const mime = importMap.imports.get(source)?.contentType;
				const dataUri = utilities.bufferToDataUri(buffer, mime);
				$(link).attr("href", dataUri);
				break;
			}

			case "stylesheet": {
				const linkSource = await importMap.loadImport({ file: source });

				$(link).replaceWith(html`
					<style>
						${linkSource}
					</style>
				`);
				break;
			}
		}
	}
};

export const script: InlineFunction = async ($, baseUrl) => {
	for (const script of $("script[src]")) {
		log.info(`loading \`script\` ${script.attribs.src}`);
		const source = utilities.isUrl(script.attribs.src, baseUrl);
		if (!source) continue;

		const dirname = source.startsWith("http")
			? undefined
			: path.posix.dirname(new URL(source).pathname);

		let scriptSource = await importMap.loadImport({
			dirname,
			file: source,
		});

		const parsed = await oxc.parse(source, scriptSource);

		for (const imported of parsed.module.staticImports) {
			const entries = imported.entries
				.map((entry) => {
					return `${entry.importName.name}${entry.localName ? " as " + entry.localName.value : ""}`;
				})
				.join(",");

			scriptSource = [
				scriptSource.slice(0, imported.start),
				js`const {${entries}}=await import(window["${importMap.WINDOW_KEY}"]["${imported.moduleRequest}"]);`,
				scriptSource.slice(imported.end),
			].join("");
		}

		for (const imported of parsed.module.dynamicImports) {
			scriptSource = [
				scriptSource.slice(0, imported.start),
				js`await import(window["${importMap.WINDOW_KEY}"]["${imported.moduleRequest}"]);`,
				scriptSource.slice(imported.end),
			].join("");
		}

		$(script).removeAttr("src");
		$(script).text(scriptSource);
	}
};

export const svgUse: InlineFunction = async ($, baseUrl) => {
	for (const current of $("use[href]")) {
		const [url, hash] = current.attribs.href.split("#");
		if (!hash) {
			log.warn(`no hash found for use element ${current.attribs.href}`);
			continue;
		}

		log.info(`loading \`svg>use\` ${url}#${hash}`);

		const source = utilities.isUrl(url, baseUrl);
		if (!source) {
			log.error(`unable to load source for use element`);
			continue;
		}

		const svgMap = await importMap.loadImport({ file: source });
		const $$ = cheerio.load(svgMap, { xmlMode: true });

		const symbol = $$(`symbol#${hash}`);
		const viewBox = symbol.attr("viewBox") || "0 0 24 24";
		const inner = symbol.html();
		if (!inner) {
			throw new Error("unable to parse parent");
		}

		$(current).parent().attr("viewBox", viewBox);
		$(current).replaceWith(inner);
	}
};
