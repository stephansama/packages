import { z } from "zod";

export const actionsSchema = z
	.enum(["ACTION", "PKG", "WORKSPACE", "ZOD"])
	.describe("Comment action options");

export const formatsSchema = z
	.enum(["LIST", "TABLE"])
	.default("TABLE")
	.optional();

export const languageSchema = z.enum(["JS", "RS"]).optional().default("JS");

export const headingsSchema = z
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
	.describe("Table heading options");

export const tableHeadingsSchema = z
	.record(actionsSchema, headingsSchema.array().optional())
	.optional()
	.describe("Table heading action configuration")
	.default({
		ACTION: ["name", "required", "default", "description"],
		PKG: ["name", "version", "devDependency"],
		WORKSPACE: ["name", "version", "downloads", "description"],
		ZOD: [],
	});

export const templatesSchema = z.object({
	downloadImage: z
		.string()
		.optional()
		.default("https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F"),
	emojis: z
		.record(headingsSchema, z.string())
		.optional()
		.describe("Table heading emojis used when enabled")
		.default({
			default: "⚙️",
			description: "📝",
			devDependency: "💻",
			downloads: "📥",
			name: "🏷️",
			private: "🔒",
			required: "",
			version: "",
		}),
	registryUrl: z
		.string()
		.optional()
		.default("https://www.npmjs.com/package/{{name}}"),
	versionImage: z
		.string()
		.optional()
		.default(
			"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F",
		),
});

export const defaultTemplates = templatesSchema.parse({});
export const defaultTableHeadings = tableHeadingsSchema.parse(undefined);

const _configSchema = z.object({
	affectedRegexes: z.string().array().optional().default([]),
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
	removeScope: z.string().optional().default("").meta({
		description: "Remove common workspace scope",
	}),
	templates: templatesSchema
		.optional()
		.default(defaultTemplates)
		.describe(
			"Handlebars templates used to fuel list and table generation",
		),
	useToc: z.boolean().default(false).meta({
		alias: "t",
		description: "generate table of contents for readmes",
	}),
	verbose: z.boolean().default(false).meta({
		alias: "v",
		description: "whether or not to display verbose logging",
	}),
});

export const configSchema = _configSchema.optional();

/** @typedef {Partial<z.infer<typeof _configSchema>>} Config */
