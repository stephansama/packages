import type { Config } from "eslint/config";

import command from "eslint-plugin-command/config";

export type Options = Parameters<typeof command>[0];

export function config(options?: Options): Config[] {
	const configs = new Array<Config>();

	configs.push({
		...command(options),
		name: "stephansama/command",
	});

	return configs;
}
