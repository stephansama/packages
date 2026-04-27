import e18e from "@e18e/eslint-plugin";
import { type Config, defineConfig } from "eslint/config";
import * as jsonParser from "jsonc-eslint-parser";

import * as glob from "@/glob";

export function config(): Config[] {
	return defineConfig([
		{
			extends: ["e18e/recommended"],
			files: [...glob.PKG_JSON],
			languageOptions: { parser: jsonParser },
			plugins: { e18e },
		},
		{
			name: "stephansama/e18e",
			plugins: { e18e },
			rules: {
				"e18e/ban-dependencies": "error",
			},
		},
	]);
}
