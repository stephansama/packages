import { config as astro } from "./astro";
import { config as baseline } from "./baseline";
import { config as command } from "./command";
import { config as css } from "./css";
import { config as e18e } from "./e18e";
import { config as gitignore } from "./gitignore";
import { config as javascript } from "./javascript";
import { config as jsdoc } from "./jsdoc";
import { config as json } from "./json";
import { config as lit } from "./lit";
import { config as markdown } from "./markdown";
import { config as node } from "./node";
import { config as packagejson } from "./packagejson";
import { config as perfectionist } from "./perfectionist";
import { config as pnpm } from "./pnpm";
import { config as prettier } from "./prettier";
import { config as regexp } from "./regexp";
import { config as storybook } from "./storybook";
import { config as svelte } from "./svelte";
import { config as typescript } from "./typescript";
import { config as unicorn } from "./unicorn";
import { config as vue } from "./vue";
import { config as zod } from "./zod";

export const configs = {
	astro,
	baseline,
	command,
	css,
	e18e,
	gitignore,
	javascript,
	jsdoc,
	json,
	lit,
	markdown,
	node,
	packagejson,
	perfectionist,
	pnpm,
	prettier,
	regexp,
	storybook,
	svelte,
	typescript,
	unicorn,
	vue,
	zod,
};

export type StephansamaConfig = keyof typeof configs;

export const order = [] satisfies Array<StephansamaConfig>;

/** Packages that will auto enable configurations */
export const autoEnableMap = {
	astro: ["astro"],
	lit: ["lit"],
	prettier: ["prettier"],
	storybook: ["storybook"],
	vue: ["vue", "nuxt", "vitepress", "@slidev/cli"],
	zod: ["zod"],
} satisfies Partial<Record<keyof typeof configs, string[]>>;
