import { enable } from "obug";
import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import { moduleName } from "./util";

const args = {
	config: { alias: "c", description: "Path to config file", type: "string" },
	output: {
		alias: "o",
		description: "Output file for commit-msg",
		type: "string",
	},
} satisfies Record<string, Options>;

export async function parseArgs() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(args)
		.help("h")
		.alias("h", "help")
		.epilogue(`--> @stephansama open-source ${new Date().getFullYear()}`);

	const parsed = await yargsInstance
		.wrap(yargsInstance.terminalWidth())
		.parse();

	if (parsed.verbose) enable(`${moduleName}*`);

	return parsed;
}
