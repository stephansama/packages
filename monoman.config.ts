import { defineConfig } from "monoman";

type PackageJsonLike = Record<string, Record<string, string> | string>;

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
]);
