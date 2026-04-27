import type { Config } from "eslint/config";

import gitignore from "eslint-config-flat-gitignore";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			ignores: glob.EXCLUDES,
			name: "stephansama/global-ignores",
		},
		{
			...gitignore({ strict: false }),
			name: "stephansama/gitignore",
		},
	];
}
