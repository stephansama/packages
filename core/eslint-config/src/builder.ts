import type { Config } from "eslint/config";

import * as auto from "./auto";
import * as configs from "./configs";
import { hasPackage } from "./environment";

export type BuilderOptions = Partial<{
	/** Auto enable configuration options based on the current working project */
	autoEnable: boolean;
	configs: Array<Config>;
}>;

export type ConfigOptions = Partial<{
	[K in keyof typeof configs]: boolean | Parameters<(typeof configs)[K]>[0];
}>;

export function builder(
	configOptions: ConfigOptions,
	buildOptions: BuilderOptions = {},
): Config[] {
	const build = new Array<Config>();

	buildOptions.autoEnable ??= true;

	if (buildOptions.autoEnable) {
		for (const key in auto) {
			configOptions[key as keyof typeof configOptions] ??= auto[
				key as keyof typeof auto
			].some((module) => hasPackage(module));
		}
	}

	for (const [config, input] of Object.entries(configOptions).toSorted(
		([a]) => (a === "typescript" ? 0 : -1),
	)) {
		if (!input) continue;

		const parameters = typeof input === "boolean" ? undefined : input;
		build.push(...configs[config as keyof typeof configs](parameters));
	}

	if (buildOptions.configs) {
		build.push(...buildOptions.configs);
	}

	return build;
}
