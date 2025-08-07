import { z } from "zod";

const _configSchema = z.object({
	defaultLanguage: z.enum(["JS", "RS"]).default("JS").meta({
		alias: "l",
		description: "Default language to infer projects from",
	}),
	disableEmojis: z.boolean().default(false).meta({
		alias: "e",
		description: "Whether or not to use emojis in markdown table headings",
	}),
	onlyReadmes: z.boolean().default(true).meta({
		alias: "r",
		description: "Whether or not to only traverse readmes",
	}),
});

export const configSchema = _configSchema.optional();
