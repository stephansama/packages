import type { ConfigOptions } from "./builder";

export const base = {
	baseline: true,
	e18e: true,
	gitignore: true,
	javascript: true,
	jsdoc: true,
	json: true,
	markdown: true,
	packagejson: true,
	perfectionist: true,
	prettier: true,
	regexp: true,
	typescript: true,
	unicorn: true,
	zod: true,
} as const satisfies ConfigOptions;

export const astro = { astro: true } as const satisfies ConfigOptions;

export const pnpm = { pnpm: true } as const satisfies ConfigOptions;

export const storybook = { storybook: true } as const satisfies ConfigOptions;

export const svelte = { svelte: true } as const satisfies ConfigOptions;

export const library = {
	packagejson: { isLibrary: true },
} as const satisfies ConfigOptions;
