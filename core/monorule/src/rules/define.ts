import type { BuiltinParseEnumSchema } from "@/schema";
import type * as types from "@/type";

import type { Rule } from "./type";

export function defineRule<
	T,
	const Errors extends Record<string, types.ErrorValue>,
	Context = types.DirtyFile,
>(
	rule: types.FunctionParserRule<T, Errors, Context>,
): types.FunctionParserRule<T, Errors, Context>;
export function defineRule<
	const Parse extends BuiltinParseEnumSchema,
	const Errors extends Record<string, types.ErrorValue>,
	Context = types.DirtyFile,
>(
	rule: types.DefaultParserRule<
		Parse,
		Errors,
		types.DefaultRuleParseTypeExtract<Parse>,
		Context
	>,
): types.DefaultParserRule<
	Parse,
	Errors,
	types.DefaultRuleParseTypeExtract<Parse>,
	Context
>;
export function defineRule(rule?: Rule): ((r: unknown) => unknown) | Rule {
	if (rule === undefined) return (r: unknown) => r;
	rule.when = rule.when.bind(rule);
	if (rule.apply) rule.apply = rule.apply.bind(rule);
	return rule;
}
