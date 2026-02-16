import * as z from "zod";

export type LhciBasicAuthSchema = z.infer<typeof lhciBasicAuthSchema>;
export const lhciBasicAuthSchema = z.object({
	password: z.string(),
	username: z.string(),
});

export type LhciAssertSchema = z.infer<typeof lhciAssertSchema>;
export const lhciAssertSchema = z.object({
	assertions: z
		.record(
			z.string(),
			z
				.tuple([
					z.enum(["warn", "error"]),
					z.object({
						maxLength: z.number(),
						minScore: z.number(),
					}),
				])
				.or(z.enum(["off"])),
		)
		.optional(),
	budgetsFile: z.string().optional(),
	includePassedAssertions: z.boolean().optional(),
	preset: z
		.enum(["lighthouse:all", "lighthouse:recommended", "lighthouse:no-pwa"])
		.optional(),
});

export type LhciCollectSchema = z.infer<typeof lhciCollectSchema>;
export const lhciCollectSchema = z.object({
	additive: z.boolean().optional(),
	chromePath: z.string().optional(),
	headful: z.boolean().optional(),
	isSinglePageApplication: z.boolean().optional(),
	method: z.enum(["node", "psi"]).or(z.string()).default("node"),
	numberOfRuns: z.number().optional(),
	/** @see https://github.com/puppeteer/puppeteer/blob/aa246973b96c36768bf3d4db0383f7101a1b4ee9/docs/api.md#puppeteerlaunchoptions */
	puppeteerLaunchOptions: z.object({
		devtools: z.boolean(),
		handleSIGHUP: z.boolean().default(true),
		handleSIGINT: z.boolean().default(true),
		handleSIGTERM: z.boolean().default(true),
		pipe: z.boolean().default(false),
		timeout: z.number().default(30000),
	}),
	puppeteerScript: z.string().optional(),
	settings: z.object({}),
	startServerCommand: z.string().optional(),
	staticDirFileDiscoveryDepth: z.number().optional(),
	staticDistDir: z.string().optional(),
	url: z.array(z.string()).optional(),
});

export type LhciUploadSchema = z.infer<typeof lhciUploadSchema>;
export const lhciUploadSchema = z
	.discriminatedUnion("target", [
		z.object({
			basicAuth: lhciBasicAuthSchema.optional(),
			extraHeaders: z.record(z.string(), z.string()).optional(),
			ignoreDuplicateBuildFailure: z.boolean().optional(),
			serverBaseUrl: z.string().default("http://localhost:9001/"),
			target: z.literal("lhci"),
			token: z.string(),
			urlReplacementPatterns: z
				.array(z.string())
				.default([
					"s#:[0-9]{3,5}/#:PORT/#",
					"s/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/UUID/ig",
				]),
		}),
		z.object({
			outputDir: z.string(),
			reportFilenamePattern: z
				.string()
				.default(
					"%%HOSTNAME%%-%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%",
				),
			target: z.literal("filesystem"),
		}),
		z.object({
			target: z.literal("temporary-public-storage"),
			uploadUrlMap: z.boolean().default(true),
		}),
	])
	.and(
		z.object({
			githubApiHost: z.string().default("https://api.github.com"),
			githubAppToken: z.string().optional(),
			githubStatusContextSuffix: z.string().optional(),
			githubToken: z.string().optional(),
		}),
	);

export type LhciServerSchema = z.infer<typeof lhciServerSchema>;
export const lhciServerSchema = z.object({
	basicAuth: lhciBasicAuthSchema.optional(),
	logLevel: z.enum(["silent", "verbose"]).default("verbose"),
	port: z.number(),
	storage: z.object({
		sqlConnectionSsl: z.boolean().default(false),
		sqlConnectionUrl: z.string(),
		sqlDangerouslyResetDatabase: z.boolean().default(false),
		sqlDatabasePath: z.string(),
		sqlDialect: z.enum(["sqlite", "postgres", "mysql"]).default("sqlite"),
		sqlMigrationOptions: z.object({ tableName: z.string() }),
	}),
});

export type LhciWizardSchema = z.infer<typeof lhciWizardSchema>;
export const lhciWizardSchema = z.object({
	extraHeaders: z.string().optional(),
	serverBaseUrl: z.string().optional(),
});

export type LhciSchema = z.infer<typeof lhciSchema>;
export const lhciSchema = z.object({
	ci: z.object({
		assert: lhciAssertSchema.optional(),
		collect: lhciCollectSchema.optional(),
		server: lhciServerSchema.optional(),
		upload: lhciUploadSchema.optional(),
		wizard: lhciWizardSchema.optional(),
	}),
});
