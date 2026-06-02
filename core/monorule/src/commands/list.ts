import { command } from "cleye";

import type { arguments_ as CliArguments } from "../cli";

import { loadConfig } from "../config";

export const meta = command({
	flags: {
		affected: {
			default: false,
			description: "show the affected files by the rule",
			type: Boolean,
		},
	},
	name: "list",
});

export async function act(arguments_: typeof CliArguments) {
	const config = await loadConfig(arguments_);
	// TODO: list loaded rules
}
