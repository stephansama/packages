import { generateOpml, parseOpml } from "feedsmith";
import * as fs from "node:fs/promises";

const res = await fetch("https://www.xml.style/demo/opml.xml");
const text = await res.text();

await fs.mkdir("./public/opml", { recursive: true });

await fs.writeFile(
	"./public/list.xml",
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
	"./node_modules/@stephansama/catppuccin-xsl/dist/opml-mocha.xsl",
	"./public/opml/linked-opml.xsl",
);
