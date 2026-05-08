import type { Config } from "eslint/config";

import * as regexp from "eslint-plugin-regexp";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			...regexp.configs["flat/recommended"],
			name: "stephansama/regexp/setup",
		},
		{
			files: [glob.MD],
			name: "stephansama/regexp/overrides",
			rules: {
				"regexp/no-legacy-features": "off",
				"regexp/no-missing-g-flag": "off",
				"regexp/no-useless-dollar-replacements": "off",
				"regexp/no-useless-flag": "off",
			},
		},
	];
}
