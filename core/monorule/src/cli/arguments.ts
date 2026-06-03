import type * as z from "zod";

import { cli, type Flags } from "cleye";

import { commands } from "@/commands";
import { configSchema } from "@/schema";
import pkg from "~/package.json";

export const configFlags = {
	ignorePaths: {
		default: [],
		description: "list of files to ignore",
		type: [String],
	},
	ignoreRules: {
		default: [],
		description: "list of rules to ignore",
		type: [String],
	},
	ruleDirectory: {
		default: "rules",
		description: "rules directory",
		type: String,
	},
} as const satisfies Record<
	keyof z.infer<typeof configSchema>,
	Flags[keyof Flags]
>;

export type CliArguments = typeof cliArguments;
export const cliArguments = cli({
	booleanFlagNegation: true,
	commands,
	flags: {
		...configFlags,
		config: {
			alias: "c",
			default: "",
			description: `location of configuration to use`,
			type: String,
		},
		dryRun: {
			alias: "d",
			default: false,
			description: `view the affected rules and show what would change if ran normally`,
			type: Boolean,
		},
		fix: {
			default: false,
			description: `whether or not to apply the errored rules`,
			type: Boolean,
		},
		verbose: {
			alias: "v",
			default: 0,
			description: "how verbose should logging be",
			type: Number,
		},
	},
	name: pkg.name.replace("@stephansama/", ""),
	version: pkg.version,
});
