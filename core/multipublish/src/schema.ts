import * as z from "zod";

export type Config = z.input<typeof configSchema>;

export const jsrPlatformOptionsSchema = z.object({
	defaultExclude: z.array(z.string()).optional(),
	defaultInclude: z.array(z.string()).optional(),
	experimentalGenerateJSR: z.boolean().default(false),
	experimentalUpdateBunCatalogs: z.boolean().default(false),
	experimentalUpdatePnpmCatalogs: z.boolean().default(false),
});

export const npmPlatformOptionsSchema = z.object({
	registry: z.string().default("https://registry.npmjs.org/"),
	tokenEnvironmentKey: z.string().default("NODE_AUTH_TOKEN"),
});

export const configSchema = z.object({
	platforms: z.array(
		z
			.literal("jsr")
			.or(z.literal("npm"))
			.or(z.tuple([z.literal("jsr"), jsrPlatformOptionsSchema]))
			.or(z.tuple([z.literal("npm"), npmPlatformOptionsSchema])),
	),
	tmpDirectory: z.string().default(".release"),
	useChangesets: z.boolean().default(true),
});
