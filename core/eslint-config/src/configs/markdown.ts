import type { Config } from "eslint/config";

import markdown from "@eslint/markdown";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		...markdown.configs.recommended.map((config) => ({
			...config,
			name: `stephansama/markdown/${config.name}`,
		})),
		{
			files: [glob.MD],
			name: `stephansama/markdown/rules`,
			rules: {
				"baseline-js/use-baseline": "off",
				"no-irregular-whitespace": "off",
				"perfectionist/sort-modules": "off",
				"regexp/no-legacy-features": "off",
				"regexp/no-missing-g-flag": "off",
				"stephansama/jsonc/*": "off",
				"stephansama/perfectionist/*": "off",
			},
		},
	];
}
