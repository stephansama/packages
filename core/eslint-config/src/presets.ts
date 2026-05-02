import type { ConfigOptions } from "./types";

export const base = {
	baseline: true,
	e18e: true,
	gitignore: true,
	imports: true,
	javascript: true,
	jsdoc: true,
	packagejson: true,
	perfectionist: true,
	pnpm: true,
	prettier: true,
	regexp: true,
	typescript: true,
	unicorn: true,
} as const satisfies ConfigOptions;

export const zod = { zod: true } as const satisfies ConfigOptions;

export const library = {
	packagejson: { isLibrary: true },
} as const satisfies ConfigOptions;
