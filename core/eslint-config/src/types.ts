import type { Config } from "eslint/config";

import type * as configs from "./configs";

export type { Options as AstroOptions } from "./configs/astro";
export type { Options as BaselineOptions } from "./configs/baseline";
export type { Options as CommandOptions } from "./configs/command";
export type { Options as ImportOptions } from "./configs/imports";
export type { Options as NodeOptions } from "./configs/node";
export type { Options as PackageJsonOptions } from "./configs/packagejson";
export type { Options as TypeScriptOptions } from "./configs/typescript";

export type BuilderOptions = Partial<{
	/** Auto enable configuration options based on the current working project */
	autoEnable: boolean;
	/**
	 * Override eslint configuration with your own configuration (appended to
	 * the end)
	 */
	overrides: Array<Config>;
	/**
	 * Override eslint configuration with your own configuration (appended to
	 * the beginning)
	 */
	overrides_prepend: Array<Config>;
}>;

export type ConfigOptions = Partial<{
	[K in keyof typeof configs]: boolean | Parameters<(typeof configs)[K]>[0];
}>;

export type StephansamaConfig = keyof typeof configs;
