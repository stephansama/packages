import { config, globs, presets } from "@stephansama/eslint-config";

export default await config({
	...presets.base,
	...presets.library,
	...presets.zod,
	astro: true,
	e18e: {
		banDependenciesAllowList: ["cosmiconfig"],
	},
	ignore: [`./turbo/generators/**`],
	imports: {
		ignore: ["astro:.*", "virtual:.*", "$app/state"],
		noWarnOnMultipleProjects: true,
		project: ["core/*/{ts,js}config.json", "examples/*/{ts,js}config.json"],
	},
	json: true,
	markdown: true,
	node: {
		allowModules: ["vitest", "@manypkg/get-packages"],
	},
	svelte: true,
	vitest: true,
	// eslint-disable-next-line perfectionist/sort-objects
	overrides: [
		{
			files: [`examples/${globs.PKG_JSON}`],
			rules: {
				"package-json/require-description": "off",
				"pnpm/json-enforce-catalog": "off",
			},
		},
		{
			files: [`core/example/${globs.PKG_JSON}`],
			rules: {
				"package-json/no-redundant-publishConfig": "off",
			},
		},
		{
			files: ["core/alfred-kaomoji/ci.js"],
			rules: {
				"n/hashbang": "off",
				"n/no-process-exit": "off",
			},
		},
		{
			files: ["**/kaomojis.json"],
			rules: {
				"no-irregular-whitespace": "off",
			},
		},
		{
			files: [globs.MD],
			rules: {
				"e18e/no-indexof-equality": "off",
				"markdown/heading-increment": "off",
				"markdown/no-multiple-h1": "off",
				"markdown/no-space-in-emphasis": "warn",
				"no-irregular-whitespace": "off",
			},
		},
	],
});
