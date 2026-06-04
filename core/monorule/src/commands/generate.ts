import { command } from "cleye";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";

import type { CliArguments } from "@/cli/arguments";

const _dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const meta = command({
	flags: {
		config: {
			alias: "c",
			default: "monorule.config.ts",
			description: "config file location",
			type: String,
		},
		ruleDirectory: {
			alias: "c",
			default: "rules",
			description: "config file location",
			type: String,
		},
	},
	name: "generate",
});

export async function act(arguments_: CliArguments) {
	await fileExists(arguments_.flags.help + "");
	// TODO: generate default configuration
	// TODO: generate rules directory
}

export async function fileExists(file: string) {
	return await fs.promises
		.access(file)
		.then(() => true)
		.catch(() => false);
}
