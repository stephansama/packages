#!/usr/bin/env node

import { flavors } from "@catppuccin/palette";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import * as utils from "./utils.js";

const [markup, stylesheet] = await utils.loadTemplates(
	"./templates/opml/markup.xml.hbs",
	"./templates/opml/style.css.hbs",
);

await fsp.mkdir("./dist", { recursive: true });

for (const [theme, val] of Object.entries(flavors)) {
	const style = await minify.css(stylesheet(utils.convertColors(val.colors)));
	const outputFile = markup({ style });

	await fsp.writeFile(path.join("./dist", `opml-${theme}.xsl`), outputFile);
}
