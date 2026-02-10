import * as z from "zod";

export const actionsSchema = z
	.enum(["ACTION", "PKG", "USAGE", "WORKSPACE", "ZOD"])
	.meta({
		description: "Comment action options",
	});

export const formatsSchema = z.enum(["LIST", "TABLE"]).default("TABLE");

export const languageSchema = z.enum(["JS", "RS"]).default("JS");

const headingsSchema = z
	.enum([
		"default",
		"description",
		"devDependency",
		"downloads",
		"name",
		"private",
		"required",
		"version",
	])
	.meta({
		description: "Table heading options",
	});

const tableHeadingsSchema = z
	.record(actionsSchema, headingsSchema.array().optional())
	.default({
		ACTION: ["name", "required", "default", "description"],
		PKG: ["name", "version", "devDependency"],
		USAGE: [],
		WORKSPACE: ["name", "version", "downloads", "description"],
		ZOD: [],
	})
	.meta({ description: "Table heading action configuration" });

const templatesSchema = z.object({
	downloadImage: z
		.string()
		.default("https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F"),
	emojis: z
		.record(headingsSchema, z.string())
		.default({
			default: "⚙️",
			description: "📝",
			devDependency: "💻",
			downloads: "📥",
			name: "🏷️",
			private: "🔒",
			required: "",
			version: "",
		})
		.meta({ description: "Table heading emojis used when enabled" }),
	registryUrl: z.string().default("https://www.npmjs.com/package/{{name}}"),
	versionImage: z
		.string()
		.default(
			"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F",
		),
});

export const defaultTemplates = templatesSchema.parse({});
export const defaultTableHeadings = tableHeadingsSchema.parse(undefined);

const _configSchema = z.object({
	affectedRegexes: z.array(z.string()),
	collapseHeadings: z.array(z.string()),
	defaultLanguage: languageSchema.meta({
		alias: "l",
		description: "Default language to infer projects from",
	}),
	disableEmojis: z.boolean().default(false).meta({
		alias: "e",
		description: "Whether or not to use emojis in markdown table headings",
	}),
	disableMarkdownHeadings: z.boolean().default(false).meta({
		description: "Whether or not to display markdown headings",
	}),
	enablePrettier: z.boolean().default(true).meta({
		description: "Whether or not to use prettier to format the files",
	}),
	enableToc: z.boolean().default(false).meta({
		alias: "t",
		description: "generate table of contents for readmes",
	}),
	enableUsage: z.boolean().default(false).meta({
		description: "Whether or not to enable usage plugin",
	}),
	headings: tableHeadingsSchema
		.optional()
		.default(defaultTableHeadings)
		.describe("List of headings for different table outputs"),
	onlyReadmes: z.boolean().default(true).meta({
		alias: "r",
		description: "Whether or not to only traverse readmes",
	}),
	onlyShowPublicPackages: z.boolean().default(false).meta({
		alias: "p",
		description: "Only show public packages in workspaces",
	}),
	removeScope: z.string().default("").meta({
		description: "Remove common workspace scope",
	}),
	templates: templatesSchema
		.optional()
		.default(defaultTemplates)
		.describe(
			"Handlebars templates used to fuel list and table generation",
		),
	tocHeading: z.string().default("Table of contents").meta({
		description: "Markdown heading used to generate table of contents",
	}),
	usageFile: z.string().default("").meta({
		description: "Workspace level usage file",
	}),
	usageHeading: z.string().default("Usage").meta({
		description: "Markdown heading used to generate usage example",
	}),
	verbose: z.boolean().default(false).meta({
		alias: "v",
		description: "whether or not to display verbose logging",
	}),
});

export const configSchema = _configSchema.optional();

export type Config = Partial<z.infer<typeof _configSchema>>;
