import type { Config } from "eslint/config";

import eslintPluginAstro from "eslint-plugin-astro";

export const autoEnableModules = ["astro"] as const;

export function config(options: Readonly<{ disableA11yStrict: boolean }>) {
	const configs = new Array<Config>();

	configs.push(
		...eslintPluginAstro.configs.recommended.map((config) => ({
			...config,
			name: `stephansama/astro/${config.name || "anonymous"}`,
		})),
	);

	if (!options?.disableA11yStrict) {
		configs.push(
			...eslintPluginAstro.configs["jsx-a11y-strict"].map((config) => ({
				...config,
				name: `stephansama/astro-a11y/${config.name || "anonymous"}`,
			})),
		);
	}

	return configs;
}
