import type { Config } from "eslint/config";

import perfectionist from "eslint-plugin-perfectionist";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			...perfectionist.configs["recommended-natural"],
			name: "stephansama/perfectionist",
		},
		{
			files: [glob.MD],
			rules: {
				"perfectionist/sort-exports": "off",
				"perfectionist/sort-imports": "off",
				"perfectionist/sort-modules": "off",
			},
		},
	];
}
