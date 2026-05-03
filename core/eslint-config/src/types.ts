import type { Config } from "eslint/config";

import type * as configs from "@/configs";
import type * as presets from "@/presets";

import type packageJson from "../package.json";

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

export type CommonOptions = Partial<{}>;

export type * as configs from "./configs";

export type ConfigDependency = keyof (typeof packageJson)["devDependencies"];

export type ConfigOptions = Partial<{
	[K in keyof typeof configs]: boolean | Parameters<(typeof configs)[K]>[0];
}>;

export type Preset = keyof typeof presets;

export type StephansamaConfig = keyof typeof configs;
