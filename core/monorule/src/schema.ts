import type { PackageJSON } from "@manypkg/tools";

import * as z from "zod";

export type BuiltinParseEnumSchema = z.infer<typeof builtinParseEnumSchema>;
export const builtinParseEnumSchema = z.enum(["json", "txt", "yaml", "toml"]);

export type Undefinable<T extends object> = {
	[k in keyof T]: T[k] | undefined;
};

const function_ = <F>() =>
	z.custom<F>((value) => typeof value === "function", {
		error: "must be a function",
	});

export type ErrorValue = z.infer<typeof errorValueSchema>;
export const errorValueSchema = z.union([
	z.string().trim(),
	z.object({
		fixable: z.boolean().optional(),
		message: z.string().trim(),
	}),
]);

export type RuleError = z.infer<typeof errorSchema>;
export const errorSchema = z.object({
	fixable: z.boolean().optional(),
	id: z.string().trim(),
	message: z.string().trim(),
});

export type LocationContext = z.infer<typeof locationContextSchema>;
export const locationContextSchema = z.object({
	absolutePath: z.string().trim(),
	relativePath: z.string().trim(),
});

export type PackageJsonContext = z.infer<typeof packageJsonContextSchema>;
export const packageJsonContextSchema = z.object({
	json: z.custom<PackageJSON>(() => true, {
		error: "expected PackageJSON object",
	}),
});

export type PackageContext = z.infer<typeof packageContextSchema>;
export const packageContextSchema = locationContextSchema.extend(
	packageJsonContextSchema.shape,
);

export type DirtyFileBase = z.infer<typeof dirtyFileBaseSchema>;
export const dirtyFileBaseSchema = locationContextSchema.extend({
	closestPackage: z.custom<Undefinable<PackageContext>>(() => true, {
		error: "expected Undefinable<PackageContext>",
	}),
	content: z.unknown(),
	packages: z.array(packageContextSchema),
	raw: z.string().trim(),
	rootPackage: packageContextSchema.omit({ relativePath: true }),
	rule: z.string().trim(),
});

export type RuleSchema = z.input<typeof ruleSchema>;

type ApplyFunction = (
	input: unknown,
	context?: DirtyFileBase & { errors: Array<RuleError> },
) => unknown;

type ParseFunction = (input: string) => unknown;

type StringifyFunction = (input: unknown) => Promise<string> | string;

type WhenFunction = (
	input: unknown,
	context?: DirtyFileBase,
) => Array<RuleError> | void;
export const ruleSchema = z.object({
	apply: function_<ApplyFunction>().optional(),
	enabled: z.boolean().default(true),
	errors: z.record(z.string(), errorValueSchema).default({}),
	exclude: z.array(z.string().trim()).or(z.string().trim()).optional(),
	include: z.union([z.array(z.string().trim()), z.string().trim()]),
	name: z.string().trim(),
	parse: z.union([function_<ParseFunction>(), builtinParseEnumSchema]),
	stringify: function_<StringifyFunction>().optional(),
	when: function_<WhenFunction>(),
});

export type RuleMapSchema = z.infer<typeof ruleMapSchema>;
export const ruleMapSchema = z.record(z.string(), ruleSchema);

export type ConfigSchema = z.infer<typeof configSchema>;
export const configSchema = z.object({
	ignorePaths: z.array(z.string().trim()).default([]),
	ignoreRules: z.array(z.string().trim()).default([]),
	ruleDirectory: z.string().trim().default("rules"),
});

export type FullConfigSchema = z.infer<typeof fullConfigSchema>;
export const fullConfigSchema = configSchema.extend({
	rules: z.array(ruleSchema).default([]),
});
