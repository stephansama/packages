import { defineConfig } from "monoman";

type PackageJsonLike = Record<string, Record<string, string> | string>;

const oldStephansamaHeader = /# @stephansama\//;
const newStephansamaHeader = `
<div align="center">

# [\`@stephansama\`](https://github.com/stephansama) / [\`{{package}}\`](https://packages.stephansama.info/api/@stephansama/{{package}}/)

</div>
`.trim();

export default defineConfig([
	{
		contents(data: PackageJsonLike) {
			data.engines = {
				node: ">=24",
			};
			return data;
		},
		include: ["**/package.json"],
		type: "json",
	},
	{
		contents(text) {
			if (!text) return "";
			return text
				.replace(oldStephansamaHeader, "")
				.split("\n")
				.map((_, index) => {
					if (index > 0) return _;
					return newStephansamaHeader.replaceAll("{{package}}", _);
				})
				.join("\n");
		},
		exclude: ["README.md", "examples/**/README.md"],
		include: ["**/README.md"],
		type: "text",
	},
]);
