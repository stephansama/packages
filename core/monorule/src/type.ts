import type { PackageJSON } from "@manypkg/tools";

import type { BuiltinParseEnumSchema } from "./schema";

export type { BuiltinParseEnumSchema } from "./schema";

export type ContextWithErrors = { context: DirtyFile; errors: Array<Error> };

export type DefaultParserRule<
	Parse extends BuiltinParseEnumSchema,
	Errors extends Record<string, ErrorValue>,
	T = DefaultRuleParseTypeExtract<Parse>,
	Context = DirtyFile,
> = RuleBase<T, Errors, Context> & { parse: Parse };

export type DefaultRuleParseTypeExtract<T extends BuiltinParseEnumSchema> =
	T extends "txt" ? string : object;

export type DirtyFile<T = unknown> = LocationContext & {
	closestPackage: Undefinable<PackageContext>;
	/** Parsed file contents of the dirty file */
	content: T;
	packages: Array<PackageContext>;
	/** Raw file contents of the dirty file */
	raw: string;
	rootPackage: Omit<PackageContext, "relativePath">;
	/** Violated rule causing the file to be dirty */
	rule: string;
};

export type Error<T extends string = string> = {
	fixable?: boolean;
	id: T;
	message?: string;
};

export type ErrorId<Errors> = Extract<keyof Errors, string>;

export type ErrorValue = string | { fixable?: boolean; message: string };

export type FunctionParserRule<
	T,
	Errors extends Record<string, ErrorValue>,
	Context = DirtyFile,
> = RuleBase<T, Errors, Context> & {
	parse(input: string): T;
};

export type LocationContext = { absolutePath: string; relativePath: string };

export type PackageContext = LocationContext & PackageJsonContext;

export type PackageJsonContext = { json: PackageJSON };

export type RuleBase<
	T,
	Errors extends Record<string, ErrorValue>,
	Context = DirtyFile,
> = ThisType<{ errors: Errors }> & {
	apply?: (
		input: NoInfer<T>,
		context?: Context & {
			errors: Array<Error<ErrorId<NoInfer<Errors>>>>;
		},
	) => Promise<T> | T | void;
	enabled?: boolean;
	errors: Errors;
	exclude?: string | string[];
	include: string | string[];
	name: string;
	stringify?(input: NoInfer<T>): Promise<string> | string;
	when(
		input: NoInfer<T>,
		context?: Context,
	): Array<Error<ErrorId<NoInfer<Errors>>>> | void;
};

export type Undefinable<T extends object> = {
	[k in keyof T]: T[k] | undefined;
};
