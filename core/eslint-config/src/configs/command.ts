import type { Config } from "eslint/config";

import command from "eslint-plugin-command/config";

export function config(options: Parameters<typeof command>[0]): Config[] {
	const configs = new Array<Config>();

	configs.push({
		...command(options),
		name: "stephansama/command",
	});

	return configs;
}
