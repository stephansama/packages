import type { Config } from "eslint/config";

import type * as configs from "./configs";
import type * as presets from "./presets";

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

export type {
	AstroOptions,
	BaselineOptions,
	CommandOptions,
	ImportOptions,
	NodeOptions,
	PackageJsonOptions,
	TypeScriptOptions,
} from "./configs";

export type CommonOptions = Partial<{}>;

export type ConfigOptions = Partial<{
	[K in keyof typeof configs]: boolean | Parameters<(typeof configs)[K]>[0];
}>;

export type Preset = keyof typeof presets;

export type StephansamaConfig = keyof typeof configs;
