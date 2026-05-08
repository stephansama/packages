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
	{
		contents(data: Record<string, unknown>) {
			data.extends = ["../../tsconfig.base.json"];

			data.compilerOptions = data?.compilerOptions || {};
			data.compilerOptions.composite = true;

			return data;
		},
		exclude: ["**/node_modules/**/tsconfig.json"],
		include: ["./core/**/tsconfig.json"],
		type: "json",
	},
]);
