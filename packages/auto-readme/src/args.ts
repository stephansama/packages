import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";
import z from "zod";

import { configSchema } from "./config-schema";

export type Args = Awaited<ReturnType<typeof parseArgs>>;

const args = {
	config: { alias: "c", description: "Path to config", type: "string" },
	file: {
		alias: "f",
		default: "./README.md",
		description: "Path to readme",
		type: "string",
	},
	...zodToYargs(),
} satisfies Record<string, Options>;

export async function parseArgs() {
	const yargsInstance = yargs(hideBin(process.argv))
		.options(args)
		.help("h")
		.alias("h", "help")
		.epilogue("--> @stephansama open-source 2025");
	return yargsInstance.wrap(yargsInstance.terminalWidth()).parse();
}

export function zodToYargs(): Record<keyof typeof shape, Options> {
	const { shape } = configSchema.unwrap();
	const entries = Object.entries(shape).map(([key, value]) => {
		const { innerType } = value.def;
		const isBoolean = innerType instanceof z.ZodBoolean;
		const isNumber = innerType instanceof z.ZodNumber;

		const yargType: Options["type"] =
			(isBoolean && "boolean") || (isNumber && "number") || "string";

		const options: Options = {
			default: value.def.defaultValue,
			type: yargType,
		};

		const meta = value.meta();

		if (meta?.alias) options.alias = meta.alias as string;
		if (meta?.description) options.description = meta.description;

		return [key, options];
	});

	return Object.fromEntries(entries);
}
