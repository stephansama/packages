import type { Config } from "eslint/config";

import { ensurePackages, interopDefault } from "@/environment";

export type Options = Partial<{
	typeAware: boolean;
}>;

export async function config(options: Options = {}): Promise<Config[]> {
	await ensurePackages("@vitest/eslint-plugin");

	const vitest = await interopDefault(import("@vitest/eslint-plugin"));

	const settings = { vitest: { typecheck: false } };

	options.typeAware ??= true;

	if (options?.typeAware) settings.vitest.typecheck = true;

	return [
		{
			files: ["**/*.test.ts", "**/*.test.js"],
			languageOptions: {
				globals: vitest.environments.env.globals,
			},
			plugins: {
				vitest,
			},
			rules: vitest.configs.recommended.rules,
			settings,
		},
	];
}
