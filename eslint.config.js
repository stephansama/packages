import pluginJs from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const configs = [
	gitignore(),
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	{
		ignores: [
			".config/*",
			"**/static/*",
			"**/sst.config.ts",
			"**/worker-configuration.d.ts",
		],
	},
	pluginJs.configs.recommended,
	{
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-console": "warn",
		},
	},
];

export default configs;
