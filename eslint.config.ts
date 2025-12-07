import pluginJs from "@eslint/js";
import json from "@eslint/json";
import gitignore from "eslint-config-flat-gitignore";
import prettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import baselineJs from "eslint-plugin-baseline-js";
import perfectionist from "eslint-plugin-perfectionist";
import pluginPnpm from "eslint-plugin-pnpm";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "eslint/config";
import globals from "globals";
import * as jsoncParser from "jsonc-eslint-parser";
import tseslint from "typescript-eslint";
import * as yamlParser from "yaml-eslint-parser";

const configs = defineConfig(
	gitignore(),
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: { ...globals.browser, ...globals.node },
			sourceType: "module",
		},
	},
	{
		extends: ["json/recommended"],
		files: ["**/*.jsonc"],
		language: "json/jsonc",
		plugins: { json },
	},
	{
		extends: ["json/recommended"],
		files: ["**/*.json5"],
		language: "json/json5",
		plugins: { json },
	},
	// @ts-expect-error unexpected plugin key but its ok
	{ plugins: { ["baseline-js"]: baselineJs } },
	baselineJs.configs["recommended-ts"]({ available: "widely", level: "error" }),
	pluginJs.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginAstro.configs.recommended,
	eslintPluginAstro.configs["jsx-a11y-strict"],
	eslintPluginReactHooks.configs.flat.recommended,
	perfectionist.configs["recommended-natural"],
	storybook.configs["flat/recommended"],
	prettier,
	{
		files: ["**/*.test.tsx", "**/*.test.jsx"],
		...testingLibrary.configs["flat/react"],
	},
	{
		files: ["package.json", "**/package.json"],
		ignores: ["**/examples/**/package.json"],
		languageOptions: { parser: jsoncParser },
		name: "pnpm/package.json",
		plugins: { pnpm: pluginPnpm },
		rules: {
			"pnpm/json-enforce-catalog": ["error", { fields: ["devDependencies"] }],
			"pnpm/json-prefer-workspace-settings": "error",
			"pnpm/json-valid-catalog": "error",
		},
	},
	{
		files: ["pnpm-workspace.yaml"],
		languageOptions: { parser: yamlParser },
		name: "pnpm/pnpm-workspace-yaml",
		plugins: { pnpm: pluginPnpm },
		rules: {
			"pnpm/yaml-no-duplicate-catalog-item": "error",
			"pnpm/yaml-no-unused-catalog-item": "error",
			"pnpm/yaml-valid-packages": "error",
		},
	},
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
);

export default configs;
