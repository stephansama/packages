#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import pkg from "../package.json" with { type: "json" };
import * as utils from "./utils.js";

const year = new Date().getFullYear();
const { config, name: package_name, version } = pkg;
const { outputFolder } = config;

const [markup, comment, stylesheet] = await utils.loadTemplates(
	"./templates/rss/markup.xml.hbs",
	"./templates/rss/comment.hbs",
	"./templates/rss/style.css.hbs",
);

const lightStyle = stylesheet(utils.convertColors(flavors.latte.colors));
const darkThemes = Object.entries(flavors).filter((theme) => theme !== "latte");

const css = String.raw;

await fsp.mkdir(outputFolder, { recursive: true });

for (const [theme, val] of darkThemes) {
	const currentStyle = style(utils.convertColors(val.colors));
	const currentComment = comment({ package_name, theme, version, year });
	const style = await minify.css(css`
		@media (prefers-color-scheme: dark) {
			${currentStyle}
		}
		@media (prefers-color-scheme: light) {
			${lightStyle}
		}
	`);
	const xml = markup({ comment: currentComment, style });
	await fsp.writeFile(path.join(outputFolder, `rss-${theme}.xsl`), xml);
}
