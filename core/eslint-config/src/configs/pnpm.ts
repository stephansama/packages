import type { Config } from "eslint/config";

import pnpm from "eslint-plugin-pnpm";
import * as jsoncParser from "jsonc-eslint-parser";
import * as yamlParser from "yaml-eslint-parser";

import * as glob from "@/glob";

export function config(): Config[] {
	return [
		{
			files: glob.PKG_JSON,
			languageOptions: { parser: jsoncParser },
			name: "stephansama/pnpm/package.json",
			plugins: { pnpm },
			rules: {
				"pnpm/json-enforce-catalog": "error",
				"pnpm/json-prefer-workspace-settings": "error",
				"pnpm/json-valid-catalog": "error",
			},
		},
		{
			files: ["pnpm-workspace.yaml"],
			languageOptions: { parser: yamlParser },
			name: "stephansama/pnpm/pnpm-workspace-yaml",
			plugins: { pnpm },
			rules: {
				"pnpm/yaml-no-duplicate-catalog-item": "error",
				"pnpm/yaml-no-unused-catalog-item": "error",
				"pnpm/yaml-valid-packages": "error",
			},
		},
	];
}
