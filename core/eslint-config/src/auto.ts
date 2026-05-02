import type { StephansamaConfig } from "./types";

/** Packages that will auto enable configurations */
export const autoEnableMap = {
	astro: ["astro"],
	lit: ["lit"],
	prettier: ["prettier"],
	storybook: ["storybook"],
	svelte: ["svelte"],
	typescript: ["typescript"],
	vue: ["vue", "nuxt", "vitepress", "@slidev/cli"],
	zod: ["zod"],
} as const satisfies Partial<Record<StephansamaConfig, string[]>>;
