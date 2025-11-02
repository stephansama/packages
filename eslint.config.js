import pluginJs from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import prettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import perfectionist from "eslint-plugin-perfectionist";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
const configs = [
	gitignore(),
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: { ...globals.browser, ...globals.node },
			sourceType: "module",
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	...eslintPluginAstro.configs["jsx-a11y-strict"],
	perfectionist.configs["recommended-natural"],
	prettier,
	{
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
		},
	},
	...storybook.configs["flat/recommended"],
];

export default configs;
