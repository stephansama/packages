import { type Config } from "eslint/config";
import * as tseslint from "typescript-eslint";

import * as glob from "@/glob";

export type Options = Readonly<{
	/** @see https://typescript-eslint.io/packages/parser#allowDefaultProject */
	allowDefaultProject?: Array<string>;
	/** @see https://typescript-eslint.io/packages/parser#defaultProject */
	defaultProject?: string;
	/** @see https://typescript-eslint.io/packages/parser#loadTypeScriptPlugins */
	loadTypeScriptPlugins?: boolean;
	/** @see https://typescript-eslint.io/packages/parser#maximumdefaultprojectfilematchcount_this_will_slow_down_linting */
	maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING?: number;
}>;

export function config(options: Options = {}): Config[] {
	return [
		{
			files: [glob.TS, glob.TSX],
			languageOptions: {
				parserOptions: {
					projectService: options,
				},
			},
			name: `stephansama/tseslint/setup`,
		},
		...tseslint.configs.recommendedTypeChecked.map((config) => ({
			...config,
			files: [glob.TS, glob.TSX],
			name: `stephansama/tseslint/${config.name || "anonymous"}`,
		})),
		{
			files: [glob.TS, glob.TSX],
			name: `stephansama/tseslint/overrides`,
			rules: {
				"@typescript-eslint/no-empty-object-type": "off",
				"@typescript-eslint/no-unused-vars": [
					"error",
					{
						args: "all",
						argsIgnorePattern: "^_",
						caughtErrors: "all",
						caughtErrorsIgnorePattern: "^_",
						destructuredArrayIgnorePattern: "^_",
						ignoreRestSiblings: true,
						varsIgnorePattern: "^_",
					},
				],
			},
		},
	];
}
