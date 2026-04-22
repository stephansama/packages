import * as cheerio from "cheerio";
import { default as html } from "dedent";

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

		const importedImage = await importMap.loadImport(src);
		const extension = img.attribs.src
			.split(".")
			.at(-1)
			?.replace(/#.*/, "")
			.replace(/\?.*/, "");

		switch (extension) {
			case "svg": {
				if (img.attribs.src.includes("#")) {
					const $$ = cheerio.load(importedImage, { xmlMode: true });
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
						utilities.str2ab(importedImage),
						importMap.imports.get(src)?.contentType,
					);
					$(img).attr("src", dataUri);
				}
				break;
			}
			default: {
				const dataUri = await utilities.bufferToDataUri(
					utilities.str2ab(importedImage),
					importMap.imports.get(src)?.contentType,
				);
				$(img).attr("src", dataUri);
			}
		}
	}
};

export async function link($: cheerio.CheerioAPI, baseUrl: string) {
	for (const link of $("link[href]")) {
		log.info(`loading \`link\` ${link.attribs.href}`);

		const src = utilities.isUrl(link.attribs.href, baseUrl);
		if (!src) continue;

		const linkSrc = await importMap.loadImport(src);

		switch (link.attribs.rel) {
			case "apple-touch-icon":
			case "icon":
			case "shortcut icon": {
				const buffer = utilities.str2ab(linkSrc);
				const mime = importMap.imports.get(src)?.contentType;
				const dataUri = await utilities.bufferToDataUri(buffer, mime);
				$(link).attr("href", dataUri);
				break;
			}

			case "stylesheet": {
				$(link).replaceWith(
					html`<style>
						${linkSrc}
					</style>`,
				);
				break;
			}
		}
	}
}

export async function svgUse($: cheerio.CheerioAPI, baseUrl: string) {
	for (const svgUse of $("use[href]")) {
		const [url, hash] = svgUse.attribs.href.split("#");
		if (!hash) {
			log.warn(`no hash found for use element ${svgUse.attribs.href}`);
			continue;
		}

		log.info(`loading \`svg>use\` ${url}#${hash}`);

		const src = utilities.isUrl(url, baseUrl);
		if (!src) {
			log.error(`unable to load source for use element`);
			continue;
		}

		const svgMap = await importMap.loadImport(src);
		const $$ = cheerio.load(svgMap, { xmlMode: true });

		const symbol = $$(`symbol#${hash}`);
		const viewBox = symbol.attr("viewBox") || "0 0 24 24";
		const inner = symbol.html();
		if (!inner) {
			throw new Error("unable to parse parent");
		}

		$(svgUse).parent().attr("viewBox", viewBox);
		$(svgUse).replaceWith(inner);
	}
}
