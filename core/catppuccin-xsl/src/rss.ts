#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { rssSchema } from "@templates/schema";
import { minify } from "minify";

import pkg from "../package.json" with { type: "json" };
import * as utils from "./utils";

const lightColors = utils.convertColors(flavors.latte.colors);
const lightStyle = await rssSchema.compile("style", lightColors);
const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

for (const [theme, val] of darkThemes) {
	const colors = utils.convertColors(val.colors);
	const currentStyle = await rssSchema.compile("style", colors);
	const currentComment = await rssSchema.compile("comment", {
		package_name: pkg.name,
		theme,
		version: pkg.version,
		year: new Date().getFullYear(),
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

	await utils.writeFile(`rss-${theme}.xsl`, xml);
}
