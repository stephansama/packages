#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { rssSchema } from "@templates/schema";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import pkg from "../package.json" with { type: "json" };
import { convertColors } from "./utils";

const year = new Date().getFullYear();
const { config, name: package_name, version } = pkg;
const { outputFolder } = config;

const lightStyle = await rssSchema.compile(
	"style",
	convertColors(flavors.latte.colors),
);
const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

await fsp.mkdir(outputFolder, { recursive: true });

for (const [theme, val] of darkThemes) {
	const colors = convertColors(val.colors);
	const currentStyle = await rssSchema.compile("style", colors);
	const currentComment = await rssSchema.compile("comment", {
		package_name,
		theme,
		version,
		year,
	});

	const style = await minify.css(
		await rssSchema.compile("themeStylesheet", {
			darkStyle: currentStyle,
			lightStyle,
		}),
	);

	const xml = await rssSchema.compile("markup", {
		comment: currentComment,
		style,
	});

	await fsp.writeFile(path.join(outputFolder, `rss-${theme}.xsl`), xml);
}
