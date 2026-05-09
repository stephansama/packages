#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { sitemapSchema } from "@templates/schema";
import { minify } from "minify";

import * as utilities from "./utilities";

const lightColors = utilities.convertColors(flavors.latte.colors);
const lightStyle = await sitemapSchema.compile("style", lightColors);
const darkThemes = Object.entries(flavors).filter(
	([theme]) => theme !== "latte",
);

for (const [theme, value] of darkThemes) {
	const colors = utilities.convertColors(value.colors);
	const currentStyle = await sitemapSchema.compile("style", colors);
	const themeStylesheet = await sitemapSchema.compile("themeStylesheet", {
		darkStyle: currentStyle,
		lightStyle,
	});
	const style = await minify.css(themeStylesheet);
	const xml = await sitemapSchema.compile("markup", { style });
	await utilities.writeFile(`sitemap-${theme}.xsl`, xml);
}
