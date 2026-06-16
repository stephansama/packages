import type { BuiltinParseEnumSchema } from "@/schema";
import type { DefaultParserRule, ErrorValue, FunctionParserRule } from "@/type";

export type Rule =
	| DefaultParserRule<BuiltinParseEnumSchema, Record<string, ErrorValue>>
	| FunctionParserRule<unknown, Record<string, ErrorValue>>;
export type RuleMap = Record<string, Rule>;
