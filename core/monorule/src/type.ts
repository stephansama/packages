import type {
	BuiltinParseEnumSchema,
	DirtyFileBase,
	ErrorValue,
	RuleError,
	RuleSchema,
} from "./schema";

export type {
	BuiltinParseEnumSchema,
	ErrorValue,
	LocationContext,
	PackageContext,
	PackageJsonContext,
	Undefinable,
} from "./schema";

export type DefaultParserRule<
	Parse extends BuiltinParseEnumSchema,
	Errors extends Record<string, ErrorValue>,
	T = DefaultRuleParseTypeExtract<Parse>,
	Context = DirtyFile,
> = RuleBase<T, Errors, Context> & { parse: Parse };

export type DefaultRuleParseTypeExtract<T extends BuiltinParseEnumSchema> =
	T extends "txt" ? string : object;

export type DirtyFile<T = unknown> = Omit<DirtyFileBase, "content"> & {
	content: T;
};

export type Error<T extends string = string> = Omit<
	RuleError,
	"id" | "message"
> & {
	id: T;
	message?: string;
};

export type ErrorId<Errors> = Extract<keyof Errors, string>;

export type FunctionParserRule<
	T,
	Errors extends Record<string, ErrorValue>,
	Context = DirtyFile,
> = RuleBase<T, Errors, Context> & {
	parse(input: string): T;
};

export type RuleBase<
	T,
	Errors extends Record<string, ErrorValue>,
	Context = DirtyFile,
> = Omit<RuleSchema, "apply" | "errors" | "parse" | "stringify" | "when"> &
	ThisType<{ errors: Errors }> & {
		apply?: (
			input: NoInfer<T>,
			context?: Context & {
				errors: Array<Error<ErrorId<NoInfer<Errors>>>>;
			},
		) => Promise<T> | T;
		errors: Errors;
		stringify?(input: NoInfer<T>): Promise<string> | string;
		when(
			input: NoInfer<T>,
			context?: Context,
		): Array<Error<ErrorId<NoInfer<Errors>>>> | void;
	};
