import Handlebars from "handlebars";
import { minify } from "minify";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

const opts = { encoding: "utf8" };

const markup = await fsp.readFile("./template/markup.xsl.hbs", opts);
const stylesheet = await fsp.readFile("./template/style.xsl.hbs", opts);

const markupTemplate = Handlebars.compile(markup);
const stylesheetTemplate = Handlebars.compile(stylesheet);

const outputFile = markupTemplate({
	style: await minify.css(stylesheetTemplate()),
});

await fsp.mkdir("./dist", { recursive: true });

await fsp.writeFile(path.join("./dist", "catppuccin-opml.xsl"), outputFile);
