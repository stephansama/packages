#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { sitemapSchema } from "@templates/schema";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import * as utils from "./utils.js";

await fsp.mkdir("./dist", { recursive: true });

const lightStyle = await sitemapSchema.compile(
	"style",
	utils.convertColors(flavors.latte.colors),
);

const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

for (const [theme, val] of darkThemes) {
	const colors = utils.convertColors(val.colors);
	const currentStyle = await sitemapSchema.compile("style", colors);
	const themeStylesheet = await sitemapSchema.compile("themeStylesheet", {
		darkStyle: currentStyle,
		lightStyle,
	});
	const style = await minify.css(themeStylesheet);
	const xml = await sitemapSchema.compile("markup", { style });
	await fsp.writeFile(path.join("./dist", `sitemap-${theme}.xsl`), xml);
}
