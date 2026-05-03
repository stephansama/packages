import * as z from "zod";

export type JsrPlatformOptionsSchema = z.infer<typeof jsrPlatformOptionsSchema>;
export const jsrPlatformOptionsSchema = z.object({
	allowSlowTypes: z.boolean().default(true),
	defaultExclude: z.array(z.string().trim()).optional(),
	defaultInclude: z.array(z.string().trim()).optional(),
	experimentalGenerateJSR: z.boolean().default(false),
	experimentalUpdateCatalogs: z.boolean().default(false),
	tokenEnvironmentKey: z.string().trim().default("JSR_AUTH_TOKEN"),
});

export type NpmPlatformOptionsSchema = z.infer<typeof npmPlatformOptionsSchema>;
export const npmPlatformOptionsSchema = z.object({
	registry: z.string().trim().default("https://registry.npmjs.org/"),
	strategy: z.enum([".npmrc", "package.json"]).default(".npmrc"),
	tokenEnvironmentKey: z.string().trim().default("NODE_AUTH_TOKEN"),
});

export type PlatformsSchema = z.input<typeof platformsSchema>;
export const platformsSchema = z.array(
	z
		.literal("jsr")
		.or(z.literal("npm"))
		.or(z.tuple([z.literal("jsr"), jsrPlatformOptionsSchema]))
		.or(z.tuple([z.literal("npm"), npmPlatformOptionsSchema])),
);

export type Config = z.input<typeof configSchema>;
export const configSchema = z.object({
	platforms: platformsSchema,
	tmpDirectory: z.string().trim().default(".release"),
	useChangesets: z.boolean().default(true),
});
