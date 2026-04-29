import type { Config } from "eslint/config";

import css from "@eslint/css";

export function config(): Config[] {
	return [
		{
			files: ["**/*.css"],
			language: "css/css",
			name: "stephansama/css",
			plugins: { css },
			rules: {
				"font-family-fallbacks": "error",
				"no-duplicate-imports": "error",
				"no-duplicate-keyframe-selectors": "error",
				"no-empty-blocks": "error",
				"no-important": "error",
				"no-invalid-at-rule-placement": "error",
				"no-invalid-at-rules": "error",
				"no-invalid-named-grid-areas": "error",
				"no-invalid-properties": "error",
				"no-unmatchable-selectors": "error",
				"prefer-logical-properties": "error",
				"relative-font-units": "error",
				"selector-complexity": "error",
				"use-baseline": "error",
				"use-layers": "error",
			},
		},
	];
}
