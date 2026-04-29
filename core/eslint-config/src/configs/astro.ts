import type { Config } from "eslint/config";

import eslintPluginAstro from "eslint-plugin-astro";

export const autoEnableModules = ["astro"] as const;

export function config(options: Readonly<{ disableA11yStrict: boolean }>) {
	const configs = new Array<Config>();

	configs.push(
		...eslintPluginAstro.configs.recommended.map((config) => ({
			...config,
			name: `stephansama/${config.name || "anonymous"}`,
		})),
	);

	if (!options?.disableA11yStrict) {
		configs.push(
			...eslintPluginAstro.configs["jsx-a11y-strict"].map((config) => ({
				...config,
				name: `stephansama/a11y/${config.name || "anonymous"}`,
			})),
		);
	}

	return configs;
}
