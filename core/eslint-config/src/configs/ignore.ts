import type { Config } from "eslint/config";

import gitignore from "eslint-config-flat-gitignore";

import * as glob from "@/glob";

export type Options = Array<string>;

export function config(ignoreList: Options): Config[] {
	const configs = new Array<Config>();
	configs.push(
		{
			ignores: glob.EXCLUDES,
			name: "stephansama/ignore/global",
		},
		{
			...gitignore({ strict: false }),
			name: "stephansama/ignore/git",
		},
	);

	if (ignoreList) {
		configs.push({
			ignores: ignoreList,
			name: "stephansama/ignore/extended",
		});
	}

	return configs;
}
