import fs from "node:fs";
import RSS from "rss";

const node_dir = "node_modules/@stephansama/catppuccin-rss/dist/";

const themes = fs.readdirSync(node_dir).map((dir) => dir.replace(".xsl", ""));

// load xml themes from package
const xmlThemes = themes.map((theme) =>
	fs.readFileSync(
		`node_modules/@stephansama/catppuccin-rss/dist/${theme}.xsl`,
		{ encoding: "utf-8" },
	),
);

themes.forEach((theme, i) => {
	fs.writeFileSync(`public/${theme}.xsl`, xmlThemes[i]);
});

const feed = new RSS({
	copyright: `${new Date().getFullYear()} Stephan Randle`,
	language: "en",
	title: "Catppuccin RSS example",
});

Array.from({ length: 4 }, (_, i) => `Catppuccin RSS example ${i + 1}`).forEach(
	(example) =>
		feed.item({
			author: "Stephan Randle",
			description: example + " Description",
			title: example,
		}),
);

const xmlPrefix = '<?xml version="1.0" encoding="UTF-8"?>';

const rssXmlString = feed.xml();

themes.forEach((theme) => {
	const xmlSuffix = `<?xml-stylesheet href="./${theme}.xsl" type="text/xsl"?>`;
	const header = [xmlPrefix, xmlSuffix].join("\n");
	fs.writeFileSync(
		`public/${theme}.xml`,
		rssXmlString.replace(xmlPrefix, header),
	);
});
