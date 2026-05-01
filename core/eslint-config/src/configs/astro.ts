import type { Config } from "eslint/config";

import { ensurePackages, interopDefault } from "@/environment";

export const autoEnableModules = ["astro"] as const;

export async function config(
	options: Readonly<{ disableA11yStrict: boolean }>,
) {
	const configs = new Array<Config>();

	await ensurePackages("eslint-plugin-astro");

	const astro = await interopDefault<typeof import("eslint-plugin-astro")>(
		import("eslint-plugin-astro"),
	);

	configs.push(
		...astro.configs.recommended.map((config) => ({
			...config,
			name: `stephansama/${config.name || "anonymous"}`,
		})),
	);

	if (!options?.disableA11yStrict) {
		configs.push(
			...astro.configs["jsx-a11y-strict"].map((config) => ({
				...config,
				name: `stephansama/a11y/${config.name || "anonymous"}`,
			})),
		);
	}

	return configs;
}
