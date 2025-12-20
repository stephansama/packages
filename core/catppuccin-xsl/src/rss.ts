#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { rssSchema } from "@templates/schema";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import pkg from "../package.json" with { type: "json" };
import { convertColors } from "./utils";

const lightColors = convertColors(flavors.latte.colors);
const lightStyle = await rssSchema.compile("style", lightColors);
const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

await fsp.mkdir("./dist", { recursive: true });

for (const [theme, val] of darkThemes) {
	const colors = convertColors(val.colors);
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

	await fsp.writeFile(path.join("./dist", `rss-${theme}.xsl`), xml);
}
