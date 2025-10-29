import { generateOpml, parseOpml } from "feedsmith";
import * as fs from "node:fs/promises";

const res = await fetch("https://www.xml.style/demo/opml.xml");
const text = await res.text();

await fs.writeFile(
	"./public/list.opml",
	generateOpml(parseOpml(text), {
		stylesheets: [
			{
				href: "/opml/linked-opml.xsl",
				title: "Catppuccin OPML feed",
				type: "text/xsl",
			},
		],
	}),
);

await fs.copyFile(
	"./node_modules/@stephansama/catppuccin-opml/dist/catppuccin-opml.xsl",
	"./public/opml/linked-opml.xsl",
);
