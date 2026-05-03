import { defineConfig } from "monoman";

export default defineConfig([
	{
		contents(data: Record<string, Record<string, string> | string>) {
			data.engines = {
				node: ">=24",
			};
			return data;
		},
		exclude: ["exclude/package.json"],
		// Globs to match files
		include: ["**/package.json"],
		type: "json",
	},
]);
