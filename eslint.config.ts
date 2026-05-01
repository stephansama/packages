import { config, globs, presets } from "@stephansama/eslint-config";

const t = "";

export default config(
	{
		...presets.base,
		...presets.library,
		astro: true,
		json: true,
		node: {
			allowModules: ["vitest", "@manypkg/get-packages"],
		},
		zod: true,
	},
	{
		configs: [
			{
				files: [`examples/${globs.PKG_JSON}`],
				rules: {
					"pnpm/json-enforce-catalog": "off",
				},
			},
			{
				files: ["**/kaomojis.json"],
				rules: {
					"no-irregular-whitespace": "warn",
				},
			},
			{
				files: [globs.MD],
				rules: {
					"e18e/no-indexof-equality": "off",
					"markdown/heading-increment": "warn",
					"no-irregular-whitespace": "off",
				},
			},
		],
	},
);
