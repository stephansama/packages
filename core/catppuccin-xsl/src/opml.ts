#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { opmlSchema } from "@templates/schema";
import { minify } from "minify";

import * as utils from "./utils";

for (const [theme, val] of Object.entries(flavors)) {
	const colors = utils.convertColors(val.colors);
	const styleTemplate = await opmlSchema.compile("style", colors);
	const style = await minify.css(styleTemplate);
	const outputFile = await opmlSchema.compile("markup", { style });

	await utils.writeFile(`opml-${theme}.xsl`, outputFile);
}
