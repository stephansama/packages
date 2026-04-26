import * as cheerio from "cheerio";
import { default as html, default as js } from "dedent";
import path from "node:path";
import * as oxc from "oxc-parser";

import * as importMap from "./import-map";
import * as log from "./log";
import * as utilities from "./utilities";

export type InlineFunction = (
	$: cheerio.CheerioAPI,
	baseUrl: string,
) => Promise<void>;

export const img: InlineFunction = async ($, baseUrl) => {
	for (const img of $("img[src]")) {
		log.info(`loading \`img\` ${img.attribs.src}`);

		const src = utilities.isUrl(img.attribs.src, baseUrl);
		if (!src) continue;

		const importedImage = await importMap.loadImport({
			file: src,
			isBinary: true,
		});
		const extension = img.attribs.src
			.split(".")
			.at(-1)
			?.replace(/#.*/, "")
			.replace(/\?.*/, "");

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
						.replace(/'/g, "%27")
						.replace(/"/g, "%22");

					$(img).attr("src", `data:image/svg+xml,${encoded}`);
					break;
				} else {
					const dataUri = await utilities.bufferToDataUri(
						importedImage,
						importMap.imports.get(src)?.contentType,
					);
					$(img).attr("src", dataUri);
				}
				break;
			}
			default: {
				const dataUri = await utilities.bufferToDataUri(
					importedImage,
					importMap.imports.get(src)?.contentType,
				);
				$(img).attr("src", dataUri);
			}
		}
	}
};

export const link: InlineFunction = async ($, baseUrl) => {
	for (const link of $("link[href]")) {
		log.info(`loading \`link\` ${link.attribs.href}`);

		const src = utilities.isUrl(link.attribs.href, baseUrl);
		if (!src) continue;

		switch (link.attribs.rel) {
			case "apple-touch-icon":
			case "icon":
			case "shortcut icon": {
				const buffer = await importMap.loadImport({
					file: src,
					isBinary: true,
				});
				const mime = importMap.imports.get(src)?.contentType;
				const dataUri = await utilities.bufferToDataUri(buffer, mime);
				$(link).attr("href", dataUri);
				break;
			}

			case "stylesheet": {
				const linkSrc = await importMap.loadImport({ file: src });

				$(link).replaceWith(
					html`<style>
						${linkSrc}
					</style>`,
				);
				break;
			}
		}
	}
};

export const script: InlineFunction = async ($, baseUrl) => {
	for (const script of $("script[src]")) {
		log.info(`loading \`script\` ${script.attribs.src}`);
		const src = utilities.isUrl(script.attribs.src, baseUrl);
		if (!src) continue;

		const dirname = src.startsWith("http")
			? undefined
			: path.posix.dirname(new URL(src).pathname);

		let scriptSrc = await importMap.loadImport({ dirname, file: src });

		const parsed = await oxc.parse(src, scriptSrc);

		for (const imported of parsed.module.staticImports) {
			const entries = imported.entries
				.map((entry) => {
					return `${entry.importName}${entry.localName ? " as " + entry.localName : ""}`;
				})
				.join(",");

			scriptSrc = [
				scriptSrc.slice(0, imported.start),
				js`const {${entries}}=await import(window["${importMap.WINDOW_KEY}"]["${imported.moduleRequest}"]);`,
				scriptSrc.slice(imported.end),
			].join("");
		}

		for (const imported of parsed.module.dynamicImports) {
			scriptSrc = [
				scriptSrc.slice(0, imported.start),
				js`await import(window["${importMap.WINDOW_KEY}"]["${imported.moduleRequest}"]);`,
				scriptSrc.slice(imported.end),
			].join("");
		}

		$(script).removeAttr("src");
		$(script).text(scriptSrc);
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

		const src = utilities.isUrl(url, baseUrl);
		if (!src) {
			log.error(`unable to load source for use element`);
			continue;
		}

		const svgMap = await importMap.loadImport({ file: src });
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
