import type { Config } from "eslint/config";

import nodeDependenciesPlugin from "eslint-plugin-node-dependencies";
import * as packageJson from "eslint-plugin-package-json";

import * as glob from "@/glob";

export type Options = Readonly<{
	isLibrary?: boolean;
}>;

export function config(options: Options): Config[] {
	const configs = new Array<Config>();

	configs.push({
		files: glob.ALL_PKG_JSON,
		name: "stephansama/packagejson/node-dependencies",
		plugins: {
			"node-dependencies": nodeDependenciesPlugin,
		},
		rules: {
			"node-dependencies/absolute-version": "error",
			"node-dependencies/no-deprecated": "error",
			"node-dependencies/no-dupe-deps": "error",
			"node-dependencies/no-restricted-deps": "error",
			"node-dependencies/require-provenance-deps": "warn",
			"node-dependencies/valid-semver": "error",
		},
	});

	if (options?.isLibrary) {
		configs.push({
			...packageJson.configs.recommended,
			name: "stephansama/packagejson/library",
			rules: {
				...packageJson.configs.recommended.rules,
				"package-json/sort-collections": "warn",
			},
		});
	}

	return configs;
}
