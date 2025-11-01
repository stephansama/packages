#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import Handlebars from "handlebars";
import minify from "minify";
import * as fs from "node:fs";
import * as path from "node:path";

import pkg from "../package.json" with { type: "json" };

const year = new Date().getFullYear();
const { config, name: package_name, version } = pkg;
const { outputFolder } = config;

const opts = { encoding: "utf-8" };

const hbsXml = fs.readFileSync("./template/template.xml.hbs", opts);
const hbsComment = fs.readFileSync("./template/comment.hbs", opts);
const hbsStyleCss = fs.readFileSync("./template/style.css.hbs", opts);

const templateXml = Handlebars.compile(hbsXml);
const templateComment = Handlebars.compile(hbsComment);
const templateStyleCss = Handlebars.compile(hbsStyleCss);

if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

/** @satisfies {Record<string, keyof flavors>} */
const AUTO_THEME_CONFIG = {
	dark: "mocha",
	light: "latte",
};

const autoThemes = Object.values(AUTO_THEME_CONFIG);

/** @type {Record<keyof flavors, string>} */
const autoThemeStyles = {};

for (const [theme, val] of Object.entries(flavors)) {
	const filename = path.join(outputFolder, `${theme}.xsl`);
	const comment = getComment(theme);
	const style = templateStyleCss(convertColors(val.colors));

	if (autoThemes.includes(theme)) {
		autoThemeStyles[theme] = style;
	}

	const xml = templateXml({ comment, style: await minify.css(style) });
	fs.writeFileSync(filename, xml);
}

const autoComment = getComment("auto");

const css = String.raw;
const autoStyle = css`
	@media (prefers-color-scheme: dark) {
		${autoThemeStyles[AUTO_THEME_CONFIG.dark]}
	}

	@media (prefers-color-scheme: light) {
		${autoThemeStyles[AUTO_THEME_CONFIG.light]}
	}
`;

const autoBody = templateXml({
	comment: autoComment,
	style: await minify.css(autoStyle),
});

fs.writeFileSync(path.join(outputFolder, "auto.xsl"), autoBody);

/** @param {typeof flavors.mocha.colors} colors */
function convertColors(colors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce((acc, [key, hex]) => {
			acc[key] = hex;
			return acc;
		}, {});
}

/** @param {keyof typeof flavors | `auto-${keyof typeof flavors}`} theme */
function getComment(theme) {
	return templateComment({
		package_name,
		theme,
		version,
		year,
	});
}
