import * as z from "zod";

export type BuiltinParseEnumSchema = z.infer<typeof builtinParseEnumSchema>;
export const builtinParseEnumSchema = z.enum(["json", "txt", "yaml", "toml"]);

export type RuleSchema = z.infer<typeof ruleSchema>;
export const ruleSchema = z.object({
	apply: z.function().optional(),
	enabled: z.boolean().default(true),
	exclude: z.array(z.string().trim()).or(z.string().trim()).optional(),
	include: z.union([z.array(z.string().trim()), z.string().trim()]),
	name: z.string().trim(),
	parse: z.function().or(builtinParseEnumSchema),
	when: z.function(),
	// when: z.function({
	// 	input: [z.string().trim()],
	// 	output: z.boolean(),
	// }),
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
