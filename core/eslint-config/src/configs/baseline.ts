import type { Config } from "eslint/config";

import baseline from "eslint-plugin-baseline-js";

import * as glob from "@/glob";

export type Options = Readonly<{
	available?: BaselineAvailability;
	baseline?: BaselineAvailability;
	ignoreFeatures?: string[];
}>;

type BaselineAvailability = "newly" | "widely" | number;

export function config(options?: Options): Config[] {
	return [
		{
			files: [glob.negate(glob.MD), glob.TS, glob.TSX, glob.JS, glob.JSX],
			name: "stephansama/baseline",
			plugins: {
				// @ts-expect-error incorrectly typed but works properly
				"baseline-js": baseline,
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
