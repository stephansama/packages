#!/usr/bin/env node

import type * as z from "zod";

import { cli, type Flags } from "cleye";
import * as url from "node:url";

import pkg from "../package.json";
import { applyRules } from "./apply";
import { checkRules } from "./check";
import { actions, commands } from "./commands";
import { loadConfig } from "./config";
import { configSchema } from "./schema";

export const baseFlags = {
	config: {
		alias: "c",
		default: "",
		description: `location of configuration to use`,
		type: String,
	},
} as const satisfies Flags;

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

export const arguments_ = cli({
	commands,
	flags: {
		...baseFlags,
		...configFlags,
		dryRun: {
			alias: "d",
			default: false,
			description: `view the affected rules and show what would change if ran normally`,
			type: Boolean,
		},
		verbose: {
			default: 0,
			description: "how verbose should logging be",
			type: Number,
		},
	},
	name: pkg.name.replace("@stephansama/", ""),
	version: pkg.version,
});

if (url.fileURLToPath(import.meta.url) === process.argv[1]) await run();

export async function run() {
	if (arguments_.command && arguments_.command in actions) {
		actions[arguments_.command]();
		process.exit(0);
	}

	const config = await loadConfig(arguments_);

	const dirty = await checkRules(config.rules);

	await applyRules(dirty, config.rules);
}
