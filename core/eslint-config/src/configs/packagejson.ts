import type { Config } from "eslint/config";

import nodeDependenciesPlugin from "eslint-plugin-node-dependencies";
import packageJson from "eslint-plugin-package-json";

import * as glob from "@/glob";

export function config(
	options: Readonly<{
		isLibrary?: boolean;
	}>,
): Config[] {
	const configs = new Array<Config>();

	configs.push({
		files: glob.ALL_PKG_JSON,
		plugins: {
			"node-dependencies": nodeDependenciesPlugin,
		},
		rules: {
			"node-dependencies/absolute-version": "error",
			"node-dependencies/no-deprecated": "error",
			"node-dependencies/no-dupe-deps": "error",
			"node-dependencies/no-restricted-deps": "error",
			"node-dependencies/require-provenance-deps": "error",
			"node-dependencies/valid-semver": "error",
		},
	});

	if (options?.isLibrary) {
		configs.push(packageJson.configs.recommended);
	}

	return configs;
}
