import type { Config } from "eslint/config";

import baselineJs from "eslint-plugin-baseline-js";

import * as glob from "@/glob";

type BaselineAvailability = "newly" | "widely" | number;

export function config(
	options?: Readonly<{
		available?: BaselineAvailability;
		baseline?: BaselineAvailability;
		ignoreFeatures?: string[];
	}>,
): Config[] {
	return [
		{
			files: [glob.negate(glob.MD)],
			name: "stephansama/baseline",
			plugins: {
				// @ts-expect-error incorrectly typed but works properly
				"baseline-js": baselineJs,
			},
			rules: {
				// Allow only "widely available" Baseline features
				"baseline-js/use-baseline": [
					"error",
					{
						available: "widely",
						ignoreFeatures: ["top-level-await"],
						includeJsBuiltins: { preset: "auto" },
						includeWebApis: { preset: "auto" },
						...options,
					},
				],
			},
		},
	];
}
