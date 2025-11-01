import debug from "debug";
import yargs, { type Options } from "yargs";
import { hideBin } from "yargs/helpers";
import z from "zod";

import { configSchema } from "./schema";

export type Args = Awaited<ReturnType<typeof parseArgs>>;

const complexOptions = [
	"affectedRegexes",
	"collapseHeadings",
	"headings",
	"templates",
] as const;

type ComplexOptions = (typeof complexOptions)[number];

const args = {
	...zodToYargs(),
	changes: {
		alias: "g",
		default: false,
		description: "Check only changed git files",
		type: "boolean",
	},
	check: {
		alias: "k",
		default: false,
		description: "Do not write to files. Only check for changes",
		type: "boolean",
	},
	config: { alias: "c", description: "Path to config file", type: "string" },
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

	if (parsed.verbose) debug.enable("autoreadme*");

	return parsed;
}

function zodToYargs(): Omit<
	Record<keyof typeof shape, Options>,
	ComplexOptions
> {
	const { shape } = configSchema.unwrap();
	const entries = Object.entries(shape).map(([key, value]) => {
		if (complexOptions.includes(key as ComplexOptions)) return [];
		if (value.def.innerType instanceof z.ZodObject) return [];
		const meta = value.meta();
		const { innerType } = value.def;
		const isBoolean = innerType instanceof z.ZodBoolean;
		const isNumber = innerType instanceof z.ZodNumber;
		const isArray = innerType instanceof z.ZodArray;

		const yargType: Options["type"] =
			(isArray && "array") ||
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
