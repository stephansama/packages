import type { Config } from "eslint/config";

import nodePlugin from "eslint-plugin-n";

import * as glob from "@/glob";

export function config(
	options: Readonly<{
		allowModules?: Array<string>;
		resolvePaths?: Array<string>;
	}>,
): Config[] {
	return [
		{
			...nodePlugin.configs["flat/recommended"],
			files: [glob.JS, glob.JSX, glob.TS, glob.TSX],
			name: "stephansama/node",
			rules: {
				...nodePlugin.configs["flat/recommended"].rules,
				"n/no-extraneous-import": [
					"error",
					{
						allowModules: options.allowModules || [],
						resolvePaths: options.resolvePaths || [],
					},
				],
				"n/no-unpublished-bin": "off",
			},
		},
	];
}
