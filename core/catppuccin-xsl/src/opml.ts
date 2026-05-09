#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { opmlSchema } from "@templates/schema";
import { minify } from "minify";

import * as utilities from "./utilities";

for (const [theme, value] of Object.entries(flavors)) {
	const colors = utilities.convertColors(value.colors);
	const styleTemplate = await opmlSchema.compile("style", colors);
	const style = await minify.css(styleTemplate);
	const outputFile = await opmlSchema.compile("markup", { style });

	await utilities.writeFile(`opml-${theme}.xsl`, outputFile);
}
