import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";
import z from "zod";

import { configSchema } from "./schema";

export type Args = Awaited<ReturnType<typeof parseArgs>>;

const args = {
	check: {
		alias: "k",
		description: "Do not write to files. Only check for changes",
		type: "boolean",
	},
	config: { alias: "c", description: "Path to config file", type: "string" },
	file: {
		alias: "f",
		default: "./README.md",
		description: "Path to readme to alter",
		type: "string",
	},
	...zodToYargs(configSchema.unwrap()),
} satisfies Record<string, Options>;

export async function parseArgs() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(args)
		.positional("file", { array: true })
		.help("h")
		.alias("h", "help")
		.epilogue(`--> @stephansama open-source ${new Date().getFullYear()}`);
	return yargsInstance.wrap(yargsInstance.terminalWidth()).parse();
}

export function zodToYargs<T extends z.ZodObject>(
	zod: T,
): Record<keyof T["shape"], Options> {
	const { shape } = zod;
	const entries = Object.entries(shape).map(([key, value]) => {
		const meta = value.meta();
		const { innerType } = value.def;
		const isBoolean = innerType instanceof z.ZodBoolean;
		const isNumber = innerType instanceof z.ZodNumber;
		const isArray = innerType instanceof z.ZodArray;
		const isCount = isBoolean && meta.count;

		const yargType: Options["type"] =
			(isArray && "array") ||
			(isCount && "count") ||
			(isNumber && "number") ||
			(isBoolean && "boolean") ||
			"string";

		const options: Options = {
			default: value.def.defaultValue,
			type: yargType,
		};

		if (meta?.alias) options.alias = meta.alias as string;
		if (meta?.description) options.description = meta.description;

		return [key, options];
	});

	return Object.fromEntries(entries);
}
