import type * as types from "@/type";

export function defineRule<T, Context = types.DirtyFile>(
	rule: types.FunctionParserRule<T, Context>,
): types.FunctionParserRule<T, Context>;
export function defineRule<
	const Parse extends types.DefaultRuleParseType,
	Context = types.DirtyFile,
>(
	rule: types.DefaultParserRule<
		Parse,
		types.DefaultRuleParseTypeExtract<Parse>,
		Context
	>,
): types.DefaultParserRule<
	Parse,
	types.DefaultRuleParseTypeExtract<Parse>,
	Context
>;
export function defineRule(rule?: unknown): unknown {
	if (rule === undefined) return (r: unknown) => r;
	return rule;
}
