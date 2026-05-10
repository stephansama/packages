import type { Config } from "eslint/config";

import * as perfectionist from "eslint-plugin-perfectionist";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			...perfectionist.configs["recommended-natural"],
			name: "stephansama/perfectionist/setup",
		},
		{
			files: [glob.MD],
			name: "stephansama/perfectionist/overrides",
			rules: {
				"perfectionist/sort-exports": "off",
				"perfectionist/sort-imports": "off",
				"perfectionist/sort-modules": "off",
			},
		},
	];
}
