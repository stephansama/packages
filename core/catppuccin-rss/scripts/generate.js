#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import Handlebars from "handlebars";
import fs from "node:fs";

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

const comboColors = {};

for (const [theme, val] of Object.entries(flavors)) {
	const filename = outputFolder + `/${theme}.xsl`;
	const comment = getComment(theme);
	const style = templateStyleCss(convertColors(val.colors));

	if (["latte", "mocha"].includes(theme)) {
		comboColors[theme] = style;
	}

	const xml = templateXml({ comment, style });
	fs.writeFileSync(filename, xml);
}

const autoComment = getComment("auto");
const css = String.raw;
const autoStyle = css`
	@media (prefers-color-scheme: dark) {
		${comboColors["mocha"]}
	}

	@media (prefers-color-scheme: light) {
		${comboColors["latte"]}
	}
`;

const autoBody = templateXml({ comment: autoComment, style: autoStyle });

fs.writeFileSync(outputFolder + "/auto.xsl", autoBody);

/** @param {typeof flavors.mocha.colors} colors */
function convertColors(colors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce((prev, [key, hex]) => ({ ...prev, [key]: hex }));
}

/** @param {keyof typeof flavors} theme */
function getComment(theme) {
	return templateComment({
		package_name,
		theme,
		version,
		year,
	});
}
