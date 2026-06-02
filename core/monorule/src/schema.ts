import * as z from "zod";

export type ConfigSchema = z.infer<typeof configSchema>;
export const configSchema = z.object({
	ignorePaths: z.array(z.string().trim()).default([]),
	ignoreRules: z.array(z.string().trim()).default([]),
	ruleDirectory: z.string().trim().default("rules"),
});

export type FullConfigSchema = z.infer<typeof fullConfigSchema>;
export const fullConfigSchema = configSchema.extend({
	rules: z
		.array(
			z.object({
				apply: z.function(),
				name: z.string().trim(),
				parse: z.function().or(z.enum(["json", "txt", "yaml", "toml"])),
				pattern: z.string().trim(),
				when: z.function(),
				// when: z.function({
				// 	input: [z.string().trim()],
				// 	output: z.boolean(),
				// }),
			}),
		)
		.default([]),
});
