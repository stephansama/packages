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

for (const [theme, val] of Object.entries(flavors)) {
	const filename = outputFolder + `/${theme}.xsl`;
	const comment = getComment(theme);
	const style = templateStyleCss(convertColors(val.colors));
	const xml = templateXml({ comment, style });
	fs.writeFileSync(filename, xml);
}

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
