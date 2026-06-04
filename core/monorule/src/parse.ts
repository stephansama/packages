import * as toml from "smol-toml";
import * as yaml from "yaml";

import type { BuiltinParseEnumSchema } from "@/schema";
import type { FunctionParserRule } from "@/type";

export const stringifiers = {
	json: JSON.stringify,
	toml: toml.stringify,
	txt: (input) => input as string,
	yaml: yaml.stringify,
} as const satisfies Record<BuiltinParseEnumSchema, (input: unknown) => string>;

export const parsers = {
	json: JSON.parse,
	toml: toml.parse,
	txt: (input) => input,
	yaml: yaml.parse,
} as const satisfies Record<BuiltinParseEnumSchema, (input: string) => unknown>;

export function parse<T>(
	input: string,
	format: BuiltinParseEnumSchema | FunctionParserRule<T>["parse"],
): T {
	if (typeof format === "function") return format(input);
	const formatter = parsers[format];
	if (!formatter) throw new Error("unable to find formatter for parsing");
	return formatter(input) as T;
}

export function stringify(input: unknown, format: BuiltinParseEnumSchema) {
	const formatter = stringifiers[format || "json"];
	if (!formatter) {
		/* cspell:disable-next-line */
		throw new Error(`unable to find formatter for stringifier ${format}`);
	}
	return formatter(input);
}
