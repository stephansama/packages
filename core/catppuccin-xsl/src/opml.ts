#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { opmlSchema } from "@templates/schema";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import { convertColors } from "./utils";

await fsp.mkdir("./dist", { recursive: true });

for (const [theme, val] of Object.entries(flavors)) {
	const colors = convertColors(val.colors);
	const styleTemplate = await opmlSchema.compile("style", colors);
	const style = await minify.css(styleTemplate);
	const outputFile = await opmlSchema.compile("markup", { style });

	await fsp.writeFile(path.join("./dist", `opml-${theme}.xsl`), outputFile);
}
