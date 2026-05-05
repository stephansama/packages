import type { Config } from "eslint/config";

import nodePlugin from "eslint-plugin-n";
import { defineConfig } from "eslint/config";

import * as glob from "@/glob";

export type Options = Readonly<{
	allowModules?: Array<string>;
	resolvePaths?: Array<string>;
}>;

export function config(options?: Options): Config[] {
	return defineConfig({
		extends: ["n/recommended-module"],
		files: [glob.JS, glob.JSX, glob.TS, glob.TSX],
		name: `stephansama/node`,
		plugins: {
			n: nodePlugin,
		},
		rules: {
			"n/hashbang": "off",
			"n/no-extraneous-import": [
				"error",
				{
					allowModules: options?.allowModules || [],
					resolvePaths: options?.resolvePaths || [],
				},
			],
			"n/no-extraneous-require": [
				"error",
				{
					allowModules: options?.allowModules || [],
					resolvePaths: options?.resolvePaths || [],
				},
			],
			// handled by ./imports.ts
			"n/no-missing-import": "off",
			"n/no-missing-require": "off",
			"n/no-process-exit": "off",
			"n/no-unpublished-bin": "off",
		},
	});
}
