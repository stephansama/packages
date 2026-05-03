import type { Config } from "eslint/config";

import prettier from "eslint-plugin-prettier";
import recommended from "eslint-plugin-prettier/recommended";

delete recommended.rules?.["vue/html-self-closing"];

export function config(): Config[] {
	return [
		{
			name: "stephansama/prettier",
			plugins: { prettier },
			rules: {
				...recommended.rules,
				"prettier/prettier": "warn",
			},
		},
	];
}
