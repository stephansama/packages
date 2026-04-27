import type { Config } from "eslint/config";

import unicorn from "eslint-plugin-unicorn";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			...unicorn.configs.recommended,
			name: "stephansama/unicorn",
		},
		{
			rules: {
				"unicorn/prefer-global-this": "off",
				"unicorn/prevent-abbreviations": [
					"error",
					{
						allowList: Object.fromEntries(
							createUnicornAbbreviationAllowList().map((item) => [
								item,
								true,
							]),
						),
					},
				],
				"unicorn/require-module-specifiers": "off",
			},
		},
		{
			files: [glob.MD],
			rules: {
				"unicorn/expiring-todo-comments": "off",
			},
		},
	];
}

function createUnicornAbbreviationAllowList() {
	return [
		"ImportMeta",
		"ImportMetaEnv",
		"Param",
		"ProcessEnv",
		"Props",
		"Ref",
		"e18e",
		"pkg",
		"props",
		"ref",
	] as const;
}
