import type { ConfigDependency, StephansamaConfig } from "./types";

export const dependenciesMap = {
	astro: ["eslint-plugin-astro"],
	css: ["@eslint/css"],
	json: ["jsonc-eslint-parser", "eslint-plugin-jsonc"],
	lit: ["eslint-plugin-lit"],
	markdown: ["@eslint/markdown"],
	storybook: ["eslint-plugin-storybook"],
	svelte: ["eslint-plugin-svelte", "svelte-eslint-parser"],
	vitest: ["@vitest/eslint-plugin"],
	vue: [],
	zod: ["eslint-plugin-zod"],
} as const satisfies Partial<
	Record<StephansamaConfig, Array<ConfigDependency>>
>;
