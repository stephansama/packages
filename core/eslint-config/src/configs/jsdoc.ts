import type { Config } from "eslint/config";

import { jsdoc } from "eslint-plugin-jsdoc";

export function config(): Config[] {
	return [
		{
			...jsdoc({ config: "flat/recommended-typescript" }),
			name: "stephansama/jsdoc",
			rules: {
				"jsdoc/require-jsdoc": "off",
			},
		},
	];
}
