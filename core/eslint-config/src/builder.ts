import type { Config } from "eslint/config";

import type { BuilderOptions, ConfigOptions } from "./types";

import { autoEnableMap } from "./auto";
import * as configs from "./configs";
import { hasPackage } from "./environment";

type BuilderKey = keyof BuilderOptions;
type Options = BuilderOptions & ConfigOptions;

const excludeOptions = new Set<BuilderKey>([
	"autoEnable",
	"overrides",
	"overrides_prepend",
]);

export async function builder(options: Options): Promise<Config[]> {
	const build = new Array<Config>();

	options.autoEnable ??= true;

	if (options.autoEnable) {
		for (const key in autoEnableMap) {
			const currentMap = autoEnableMap[key as keyof typeof autoEnableMap];
			const enableOption = currentMap.some((module) => {
				return hasPackage(module);
			});

			// @ts-expect-error only updates valid configuration options
			options[key as keyof typeof options] ??= enableOption;
		}
	}

	if (options.overrides_prepend) build.push(...options.overrides_prepend);

	for (const [config, input] of Object.entries(options)) {
		if (!input || excludeOptions.has(config as BuilderKey)) continue;

		const parameters = typeof input === "boolean" ? undefined : input;
		// @ts-expect-error update typing later
		const result = configs[config as keyof typeof configs](parameters);

		if (result instanceof Promise) {
			build.push(...(await result));
		} else {
			build.push(...result);
		}
	}

	if (options.overrides) build.push(...options.overrides);

	return build;
}
