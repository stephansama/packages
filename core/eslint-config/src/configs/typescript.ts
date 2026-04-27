import { type Config, defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

import * as glob from "@/glob";

export const autoEnableModules = ["typescript"] as const;

export function config(): Config[] {
	return defineConfig({
		extends: [tseslint.configs.recommended],
		files: [glob.TS, glob.TSX],
		name: "stephansama/typescript",
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	});
}
