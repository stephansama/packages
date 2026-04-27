import type { Config } from "eslint/config";

import svelte from "eslint-plugin-svelte";
import parser from "svelte-eslint-parser";
import ts from "typescript-eslint";

import * as glob from "@/glob";

export const autoEnableModules = ["svelte"] as const;

export function config(): Config[] {
	return [
		{
			name: "stephansama/svelte/setup",
			plugins: { svelte },
		},
		{
			files: glob.SVELTE,
			languageOptions: {
				parser,
				parserOptions: {
					extraFileExtensions: [".svelte"],
					parser: ts.parser,
					projectService: true,
				},
			},
		},
	];
}
