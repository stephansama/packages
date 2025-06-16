import { flavors } from "@catppuccin/palette";
import Handlebars from "handlebars";
import fs from "node:fs";

import pkg from "../package.json" with { type: "json" };

const { outputFolder } = pkg.config;

const opts = { encoding: "utf-8" };

const xml = fs.readFileSync("./template/template.xml.hbs", opts);
const comment = fs.readFileSync("./template/comment.hbs", opts);
const styleCss = fs.readFileSync("./template/style.css.hbs", opts);

const templateXml = Handlebars.compile(xml);
const templateComment = Handlebars.compile(comment);
const templateStyleCss = Handlebars.compile(styleCss);

if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

Object.entries(flavors).forEach(([theme, val]) => {
	const filename = outputFolder + `/${theme}.xsl`;
	const outputStyleCss = templateStyleCss(convertColors(val.colors));
	const outputComment = templateComment({
		package_name: pkg.name,
		theme,
		version: pkg.version,
		year: new Date().getFullYear(),
	});
	const outputXml = templateXml({
		comment: outputComment,
		style: outputStyleCss,
	});
	fs.writeFileSync(filename, outputXml);
});

/**
 * @param {typeof flavors.mocha.colors} colors
 */
function convertColors(colors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce((prev, [key, hex]) => ({ ...prev, [key]: hex }));
}
