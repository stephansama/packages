import type { Config } from "eslint/config";

import zod from "eslint-plugin-zod";

export function config(): Config[] {
	return [
		{
			name: "stephansama/zod",
			plugins: { zod },
		},
	];
}
