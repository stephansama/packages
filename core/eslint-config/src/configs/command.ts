import type { Config } from "eslint/config";

import command from "eslint-plugin-command/config";

export function config(options: Parameters<typeof command>[0]): Config[] {
	return [
		{
			...command(options),
			name: "stephansama/command",
		},
	];
}
