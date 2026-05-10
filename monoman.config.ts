import { defineConfig } from "monoman";

import type pkg from "./package.json";
import type tsconfig from "./tsconfig.root.json";

export default defineConfig([
	{
		contents(data: typeof pkg) {
			data.repository = { ...data.repository };
			data.repository.url = "git+https://github.com/stephansama/packages.git";
			data.engines = { node: ">=24" };
			return data;
		},
		exclude: ["turbo/**/package.json", "scripts/package.json"],
		include: ["**/package.json"],
		type: "json",
	},
	{
		contents(data: typeof tsconfig) {
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
