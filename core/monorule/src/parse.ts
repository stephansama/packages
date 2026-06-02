import * as toml from "smol-toml";
import * as yaml from "yaml";

import type { DefaultRuleParseType, FunctionParserRule } from "./type";

export const stringifiers = {
	json: JSON.stringify,
	toml: toml.stringify,
	txt: (input) => input as string,
	yaml: yaml.stringify,
} as const satisfies Record<DefaultRuleParseType, (input: unknown) => string>;

export const parsers = {
	json: JSON.parse,
	toml: toml.parse,
	txt: (input) => input,
	yaml: yaml.parse,
} as const satisfies Record<DefaultRuleParseType, (input: string) => unknown>;

export function parse<T>(
	input: string,
	format: DefaultRuleParseType | FunctionParserRule<T>["parse"],
): T {
	if (typeof format === "function") return format(input);
	const formatter = parsers[format];
	if (!formatter) throw new Error("unable to find formatter for parsing");
	return formatter(input) as T;
}

export function stringify(input: unknown, format: DefaultRuleParseType) {
	const formatter = stringifiers[format || "json"];
	if (!formatter) {
		throw new Error(`unable to find formatter for stringifier ${format}`);
	}
	return formatter(input);
}
