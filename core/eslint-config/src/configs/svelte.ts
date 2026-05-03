import type { Config } from "eslint/config";

import * as ts from "typescript-eslint";

import { ensurePackages } from "@/environment";
import * as glob from "@/glob";

export async function config(): Promise<Config[]> {
	await ensurePackages("eslint-plugin-svelte");
	await ensurePackages("svelte-eslint-parser");

	const svelte = await import("eslint-plugin-svelte");
	const parser = await import("svelte-eslint-parser");

	return [
		{
			name: "stephansama/svelte/setup",
			plugins: { svelte: svelte.default },
		},
		{
			files: glob.SVELTE,
			languageOptions: {
				parser: parser.default,
				parserOptions: {
					extraFileExtensions: [".svelte"],
					parser: ts.parser,
					projectService: true,
				},
			},
			name: "stephansama/svelte/parser",
		},
	];
}
