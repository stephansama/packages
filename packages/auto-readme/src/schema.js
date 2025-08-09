import { z } from "zod";

const _configSchema = z.object({
	defaultLanguage: z.enum(["JS", "RS"]).optional().default("JS").meta({
		alias: "l",
		description: "Default language to infer projects from",
	}),
	disableEmojis: z.boolean().optional().default(false).meta({
		alias: "e",
		description: "Whether or not to use emojis in markdown table headings",
	}),
	onlyReadmes: z.boolean().optional().default(true).meta({
		alias: "r",
		description: "Whether or not to only traverse readmes",
	}),
	onlyShowPublicPackages: z.boolean().optional().default(false).meta({
		alias: "p",
		description: "Only show public packages in workspaces",
	}),
});

export const configSchema = _configSchema.optional();

/** @typedef {Partial<z.infer<typeof _configSchema>>} Config */
