import type { Config } from "eslint/config";

import { ensurePackages } from "@/environment";

export async function config(): Promise<Config[]> {
	await ensurePackages("@eslint/css");

	const css = await import("@eslint/css");

	return [
		{
			files: ["**/*.css"],
			language: "css/css",
			name: "stephansama/css",
			plugins: { css: css.default },
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
