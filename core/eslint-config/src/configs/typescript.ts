import * as tsparser from "@typescript-eslint/parser";
import { type Config } from "eslint/config";
import * as tseslint from "typescript-eslint";

import * as glob from "@/glob";

export type Options = Partial<{
	parser: typeof import("@typescript-eslint/parser");
	parserOptions: Partial<{
		/** @see https://typescript-eslint.io/packages/parser/#project */
		project: boolean | string;
		/** @see https://typescript-eslint.io/packages/parser#projectservice */
		projectService:
			| boolean
			| Partial<{
					/** @see https://typescript-eslint.io/packages/parser#allowDefaultProject */
					allowDefaultProject: Array<string>;
					/** @see https://typescript-eslint.io/packages/parser#defaultProject */
					defaultProject: string;
					/** @see https://typescript-eslint.io/packages/parser#loadTypeScriptPlugins */
					loadTypeScriptPlugins: boolean;
					/** @see https://typescript-eslint.io/packages/parser#maximumdefaultprojectfilematchcount_this_will_slow_down_linting */
					maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: number;
			  }>;
		tsconfigRootDir: string;
	}>;
}>;

export function config(options: Options = {}): Config[] {
	const configs = new Array<Config>();

	configs.push(
		...tseslint.configs.recommendedTypeChecked.map((config) => ({
			...config,
			files: [glob.TS, glob.TSX],
			name: `stephansama/typescript/${config.name || "anonymous"}`,
		})),
	);

	options.parserOptions ??= {};

	options.parser ??= tsparser;

	options.parserOptions.tsconfigRootDir ??= process.cwd();

	if (!options.parserOptions.project) {
		options.parserOptions.projectService ??= true;
	}

	configs.push(
		{
			files: [glob.TS, glob.TSX],
			languageOptions: options,
			name: `stephansama/typescript/setup`,
		},
		{
			files: [glob.TS, glob.TSX],
			name: `stephansama/typescript/overrides`,
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
	);

	return configs;
}
