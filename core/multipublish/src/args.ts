import { enable } from "obug";
import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import { MODULE_NAME } from "./util";

export type Args = Awaited<ReturnType<typeof parseArgs>>;

let _args: Args | null = null;

const args = {
	config: { alias: "c", description: "Path to config file", type: "string" },
	dry: { alias: "d", description: "Perform a dry run", type: "string" },
	output: { alias: "s", description: "use changesets", type: "boolean" },
	verbose: {
		alias: "v",
		description: "Enable verbose logging",
		type: "boolean",
	},
} satisfies Record<string, Options>;

export async function getArgs() {
	return (_args ??= await parseArgs());
}

export async function parseArgs() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(args)
		.help("h")
		.alias("h", "help")
		.epilogue(`--> @stephansama open-source ${new Date().getFullYear()}`);

	const parsed = await yargsInstance
		.wrap(yargsInstance.terminalWidth())
		.parse();

	if (parsed.verbose) enable(`${MODULE_NAME}*`);

	return parsed;
}
