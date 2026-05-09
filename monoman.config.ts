import { defineConfig } from "monoman";

type PackageJsonLike = Record<string, Record<string, string>>;

export default defineConfig([
	{
		contents(data: PackageJsonLike) {
			data.repository = { ...data.repository };
			data.repository.url = "git+https://github.com/stephansama/packages.git";

			data.engines = {
				node: ">=24",
			};
			return data;
		},
		exclude: ["turbo/**/package.json", "scripts/package.json"],
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
	{
		contents(data: { exclude: Array<string> }) {
			data.exclude = [
				"**/*.spec.ts",
				"**/*.test.ts",
				"**/tests/**",
				"**/{node_modules,test,book,doc,dist}/**/*",
				"**/{pages,components}/**",
				"node_modules",
			];
			return data;
		},
		exclude: ["./.config/www/typedoc.json"],
		include: ["**/typedoc.json"],
		type: "json",
	},
]);
