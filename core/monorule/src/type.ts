export type DefaultParserRule<
	Parse extends DefaultRuleParseType,
	T = DefaultRuleParseTypeExtract<Parse>,
	Context = DirtyFile,
> = RuleBase<T, Context> & { parse: Parse };

export type DefaultRuleParseType = "json" | "toml" | "txt" | "yaml";

export type DefaultRuleParseTypeExtract<T extends DefaultRuleParseType> =
	T extends "txt" ? string : object;

export type DirtyFile<T = unknown> = {
	absolutePath: string;
	/** Parsed file contents of the dirty file */
	content: T;
	/** Raw file contents of the dirty file */
	raw: string;
	relativePath: string;
	/** Violated rule causing the file to be dirty */
	rule: string;
};

export type FunctionParserRule<T, Context = DirtyFile> = RuleBase<
	T,
	Context
> & {
	parse(input: string): T;
	stringify?(input: NoInfer<T>): string;
};

export type RuleBase<T, Context = DirtyFile> = {
	apply?: ((input: NoInfer<T>) => Promise<T>) | ((input: NoInfer<T>) => T);
	context?(file: string): Context;
	enabled?: boolean;
	name: string;
	pattern: string;
	when(input: NoInfer<T>): boolean;
};
