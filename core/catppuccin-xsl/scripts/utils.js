import Handlebars from "handlebars";
import * as fsp from "node:fs/promises";

/** @param {keyof import('@catppuccin/palette').Flavors<string>} colors */
export function convertColors(colors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce((acc, [key, hex]) => {
			acc[key] = hex;
			return acc;
		}, {});
}

/**
 * @param {...string} filenames
 * @returns {Promise<import('handlebars').TemplateDelegate<unknown>[]>}
 */
export async function loadTemplates(...filenames) {
	return await Promise.all(
		filenames.map(async (filepath) => {
			const template = await fsp.readFile(filepath, { encoding: "utf8" });
			return Handlebars.compile(template);
		}),
	);
}
