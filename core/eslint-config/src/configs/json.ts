import type { Config } from "eslint/config";

import { ensurePackages } from "@/environment";

export async function config(): Promise<Config[]> {
	await ensurePackages("eslint-plugin-jsonc");

	const jsonc = await import("eslint-plugin-jsonc");

	return [
		{
			files: ["*.json", "**/*.json"],
			language: "jsonc/x",
			name: "stephansama/json/setup",
			plugins: { jsonc: jsonc.default },
		},
		{
			name: "stephansama/json/overrides",
			rules: {
				"jsonc/quote-props": "off",
				"jsonc/quotes": "off",
			},
		},
	];
}
