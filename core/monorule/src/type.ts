import type { PackageJSON } from "@manypkg/tools";

import type { BuiltinParseEnumSchema } from "./schema";

export type { BuiltinParseEnumSchema } from "./schema";

export type ContextWithErrors = { context: DirtyFile; errors: Array<Error> };

export type DefaultParserRule<
	Parse extends BuiltinParseEnumSchema,
	T = DefaultRuleParseTypeExtract<Parse>,
	Context = DirtyFile,
> = RuleBase<T, Context> & { parse: Parse };

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
	message: string;
};

export type FunctionParserRule<T, Context = DirtyFile> = RuleBase<
	T,
	Context
> & {
	parse(input: string): T;
	stringify?(input: NoInfer<T>): string;
};

export type LocationContext = { absolutePath: string; relativePath: string };

export type PackageContext = LocationContext & PackageJsonContext;

export type PackageJsonContext = { json: PackageJSON };

export type RuleBase<T, Context = DirtyFile> = {
	apply?: (input: NoInfer<T>, context?: Context) => Promise<T> | T;
	enabled?: boolean;
	exclude?: string | string[];
	include: string | string[];
	name: string;
	when(input: NoInfer<T>, context?: Context): Array<Error> | void;
};

export type Undefinable<T extends object> = {
	[k in keyof T]: T[k] | undefined;
};
