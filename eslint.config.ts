import { config, globs, presets } from "@stephansama/eslint-config";

export default await config({
	...presets.base,
	...presets.library,
	...presets.zod,
	astro: true,
	autoEnable: false,
	imports: {
		project: ["core/*/{ts,js}config.json", "examples/*/{ts,js}config.json"],
	},
	json: true,
	markdown: true,
	node: {
		allowModules: ["vitest", "@manypkg/get-packages"],
	},
	overrides: [
		{
			files: [`examples/${globs.PKG_JSON}`],
			rules: {
				"package-json/require-description": "off",
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
});
