import type { BuiltinParseEnumSchema } from "@/schema";
import type * as types from "@/type";

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
export function defineRule(rule?: unknown): unknown {
	/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
	if (rule === undefined) return (r: unknown) => r;
	// @ts-expect-error works
	rule.when = rule.when.bind(rule);
	// @ts-expect-error works
	rule.apply = rule.apply.bind(rule);
	return rule;
}
