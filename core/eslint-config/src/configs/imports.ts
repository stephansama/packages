import type { Config } from "eslint/config";

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";

export type Options = Partial<{
	ignore: Array<string>;
	project: Array<string> | string;
}>;

export function config(options?: Readonly<Options>): Config[] {
	return [
		{
			...importX.flatConfigs.recommended,
			name: "stephansama/imports/recommended",
		},
		{
			...importX.flatConfigs.typescript,
			name: "stephansama/imports/typescript",
		},
		{
			name: "stephansama/imports/overrides",
			rules: {
				"import-x/namespace": ["error", { allowComputed: true }],
				"import-x/no-unresolved": [
					"error",
					options?.ignore ? { ignore: options.ignore } : undefined,
				],
			},
		},
		{
			name: "stephansama/imports/resolver",
			settings: {
				"import-x/resolver-next": [
					createTypeScriptImportResolver({
						alwaysTryTypes: true,
						bun: true,
						project: options?.project || "tsconfig.json",
					}),
				],
			},
		},
	];
}
