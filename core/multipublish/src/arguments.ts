import { enable } from "obug";
import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import { MODULE_NAME } from "./utilities";

export type Arguments = Awaited<ReturnType<typeof parseArguments>>;

let _arguments: Arguments | undefined;

const arguments_ = {
	config: { alias: "c", description: "Path to config file", type: "string" },
	dry: { alias: "d", description: "Perform a dry run", type: "boolean" },
	released: {
		alias: "r",
		description: "packages that have been updated and require a publish",
		type: "array",
	},
	releasedFile: {
		alias: "f",
		description: "file denoting which packages have been updated",
		type: "string",
	},
	useChangesetStatus: {
		alias: "s",
		description: "path to changeset status file used to version release",
		type: "boolean",
	},
	verbose: {
		alias: "v",
		description: "Enable verbose logging",
		type: "boolean",
	},
	versionJsr: {
		alias: "j",
		description: "update version jsr configuration files",
		type: "boolean",
	},
} satisfies Record<string, Options>;

export async function getArguments() {
	return (_arguments ??= await parseArguments());
}

export async function parseArguments() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(arguments_)
		.help("h")
		.alias("h", "help")
		.epilogue(`--> @stephansama open-source ${new Date().getFullYear()}`);

	const parsed = await yargsInstance
		.wrap(yargsInstance.terminalWidth())
		.parse();

	if (parsed.verbose) enable(`${MODULE_NAME}*`);

	return parsed;
}
