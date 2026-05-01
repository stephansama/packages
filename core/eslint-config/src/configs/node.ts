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
			files: [glob.JS, glob.JSX, glob.TS, glob.TSX],
			name: `stephansama/node`,
			plugins: {
				node: nodePlugin,
			},
			rules: {
				"node/no-extraneous-import": [
					"error",
					{
						allowModules: options.allowModules || [],
						resolvePaths: options.resolvePaths || [],
					},
				],
				"node/no-extraneous-require": [
					"error",
					{
						allowModules: options.allowModules || [],
						resolvePaths: options.resolvePaths || [],
					},
				],
				"node/no-unpublished-bin": "off",
			},
		},
	];
}
