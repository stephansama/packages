import type { Config } from "eslint/config";

import { ensurePackages } from "@/environment";
import * as glob from "@/glob";

export async function config(): Promise<Config[]> {
	await ensurePackages("@eslint/markdown");
	const markdown = await import("@eslint/markdown");

	return [
		...markdown.default.configs.recommended.map((config) => ({
			...config,
			name: `stephansama/${config.name}`,
		})),
		{
			files: [glob.MD],
			name: `stephansama/markdown/rules`,
			rules: {
				"baseline-js/use-baseline": "off",
				"e18e/no-indexof-equality": "off",
				"no-irregular-whitespace": "off",
				"perfectionist/sort-modules": "off",
				"regexp/no-legacy-features": "off",
				"regexp/no-missing-g-flag": "off",
				"stephansama/jsonc/*": "off",
				"stephansama/perfectionist/*": "off",
			},
		},
	];
}
