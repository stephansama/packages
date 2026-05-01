import type { Config } from "eslint/config";

import { autoEnableMap, configs } from "./configs";
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
		for (const key in autoEnableMap) {
			configOptions[key as keyof typeof configOptions] ??= autoEnableMap[
				key as keyof typeof autoEnableMap
			].some((module) => hasPackage(module));
		}
	}

	for (const [config, input] of Object.entries(configOptions).toSorted(
		([a]) => (a === "typescript" ? 0 : -1),
	)) {
		if (!input) continue;

		const parameters = typeof input === "boolean" ? undefined : input;
		const result = configs[config as keyof typeof configs](parameters);

		if (result instanceof Promise) {
			result
				.then((current) => build.push(...current))
				.catch((error) => console.error(error));
		} else {
			build.push(...result);
		}
	}

	if (buildOptions.configs) {
		build.push(...buildOptions.configs);
	}

	return build;
}
