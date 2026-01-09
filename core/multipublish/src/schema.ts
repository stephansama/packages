import * as z from "zod";

export type JsrPlatformOptionsSchema = z.infer<typeof jsrPlatformOptionsSchema>;
export const jsrPlatformOptionsSchema = z.object({
	allowSlowTypes: z.boolean().default(true),
	commitJsrVersionUpdate: z.boolean().default(false),
	defaultExclude: z.array(z.string()).optional(),
	defaultInclude: z.array(z.string()).optional(),
	experimentalGenerateJSR: z.boolean().default(false),
	experimentalUpdateCatalogs: z.boolean().default(false),
});

export type NpmPlatformOptionsSchema = z.infer<typeof npmPlatformOptionsSchema>;
export const npmPlatformOptionsSchema = z.object({
	registry: z.string().default("https://registry.npmjs.org/"),
	strategy: z.enum([".npmrc", "package.json"]).default(".npmrc"),
	tokenEnvironmentKey: z.string().default("NODE_AUTH_TOKEN"),
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
	tmpDirectory: z.string().default(".release"),
	useChangesets: z.boolean().default(true),
});
