import type { Config } from "eslint/config";

import jsonc from "eslint-plugin-jsonc";

export function config(): Config[] {
	return [
		{
			files: ["*.json", "**/*.json"],
			language: "jsonc/x",
			plugins: { jsonc },
		},
		{
			name: "stephansama/jsonc",
			rules: {
				"jsonc/quote-props": "off",
				"jsonc/quotes": "off",
			},
		},
	];
}
