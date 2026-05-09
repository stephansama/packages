import e18e from "@e18e/eslint-plugin";
import { type Config, defineConfig } from "eslint/config";
import * as jsonParser from "jsonc-eslint-parser";

import * as glob from "@/glob";

export type Options = Partial<{
	banDependenciesAllowList: Array<string>;
	banDependenciesDisallowList: Array<string>;
}>;

type E18EOptions = Partial<{
	// https://github.com/e18e/eslint-plugin/blob/8faf4cf6cc048f16eaae50900f30ff88a9861e9b/src/rules/ban-dependencies.ts#L166
	allowed: Array<string>;
	// https://github.com/e18e/eslint-plugin/blob/8faf4cf6cc048f16eaae50900f30ff88a9861e9b/src/rules/ban-dependencies.ts#L159
	modules: Array<string>;
}>;

export function config(options: Options = {}): Config[] {
	const banDependenciesOptions: E18EOptions = {};

	if (options.banDependenciesAllowList) {
		banDependenciesOptions.allowed = options.banDependenciesAllowList;
	}

	if (options.banDependenciesDisallowList) {
		banDependenciesOptions.modules = options.banDependenciesDisallowList;
	}

	return defineConfig([
		{
			extends: ["e18e/recommended"],
			files: glob.ALL_PKG_JSON,
			languageOptions: { parser: jsonParser },
			name: "stephansama/e18e/setup",
			plugins: { e18e },
			rules: {
				"e18e/ban-dependencies": ["error", banDependenciesOptions],
				"e18e/no-indexof-equality": "off",
			},
		},
		{
			files: [glob.TS, glob.TSX],
			name: "stephansama/e18e",
			plugins: { e18e },
			rules: {
				"e18e/ban-dependencies": ["error", banDependenciesOptions],
				"e18e/no-indexof-equality": "error",
				"e18e/prefer-array-at": "error",
				"e18e/prefer-array-fill": "error",
				"e18e/prefer-array-from-map": "error",
				"e18e/prefer-array-some": "error",
				"e18e/prefer-array-to-reversed": "error",
				"e18e/prefer-array-to-sorted": "error",
				"e18e/prefer-array-to-spliced": "error",
				"e18e/prefer-date-now": "error",
				"e18e/prefer-exponentiation-operator": "error",
				"e18e/prefer-includes": "error",
				"e18e/prefer-inline-equality": "error",
				"e18e/prefer-nullish-coalescing": "error",
				"e18e/prefer-object-has-own": "error",
				"e18e/prefer-regex-test": "error",
				"e18e/prefer-spread-syntax": "error",
				"e18e/prefer-static-regex": "error",
				"e18e/prefer-timer-args": "error",
				"e18e/prefer-url-canparse": "error",
			},
		},
	]);
}
