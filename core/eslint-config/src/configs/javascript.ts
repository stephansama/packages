import type { Config } from "eslint/config";

import js from "@eslint/js";
import globals from "globals";

export function config(): Config[] {
	return [
		{ ...js.configs.recommended, name: "stephansama/js/recommended" },
		{
			languageOptions: {
				ecmaVersion: "latest",
				globals: {
					...globals.browser,
					...globals.es2021,
					...globals.node,
					document: "readonly",
					navigator: "readonly",
					window: "readonly",
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: "latest",
					sourceType: "module",
				},
				sourceType: "module",
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			name: "stephansama/javascript/setup",
		},
		{
			name: "stephansama/javascript/rules",
			rules: {
				"no-console": ["warn", { allow: ["warn", "error", "info"] }],
			},
		},
	];
}
