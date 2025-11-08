#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import * as utils from "./utils.js";

const [markup, stylesheet] = await utils.loadTemplates(
	"./templates/sitemap/markup.xml.hbs",
	"./templates/sitemap/style.css.hbs",
);

await fsp.mkdir("./dist", { recursive: true });

const lightStyle = stylesheet(utils.convertColors(flavors.latte.colors));
const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

const css = String.raw;

for (const [theme, val] of darkThemes) {
	const currentStyle = stylesheet(utils.convertColors(val.colors));
	const style = await minify.css(css`
		@media (prefers-color-scheme: dark) {
			${currentStyle}
		}
		@media (prefers-color-scheme: light) {
			${lightStyle}
		}
	`);
	const xml = markup({ style });
	await fsp.writeFile(path.join("./dist", `sitemap-${theme}.xsl`), xml);
}
