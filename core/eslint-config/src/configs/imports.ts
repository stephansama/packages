import type { Config } from "eslint/config";

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";

export type Options = Readonly<{ project: Array<string> | string }>;

export function config(options?: Options): Config[] {
	return [
		importX.flatConfigs.recommended,
		importX.flatConfigs.typescript,
		{
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
