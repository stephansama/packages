import { enable } from "obug";
import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import { moduleName } from "./utilities";

const arguments_ = {
	config: { alias: "c", description: "Path to config file", type: "string" },
	output: {
		alias: "o",
		description: "Output file for commit-msg",
		type: "string",
	},
	verbose: {
		alias: "v",
		description: "Enable verbose logging",
		type: "boolean",
	},
} satisfies Record<string, Options>;

export async function parseArguments() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(arguments_)
		.help("h")
		.alias("h", "help")
		.epilogue(`--> @stephansama open-source ${new Date().getFullYear()}`);

	const parsed = await yargsInstance
		.wrap(yargsInstance.terminalWidth())
		.parse();

	if (parsed.verbose) enable(`${moduleName}*`);

	return parsed;
}
