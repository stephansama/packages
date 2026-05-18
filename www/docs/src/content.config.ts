import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export const collections = {
	docs: defineCollection({
		loader: glob({
			base: "./src/content/docs",
			pattern: ["**/*.{md,mdx}", "!**/_media/**"],
		}),
		schema: docsSchema({
			extend: z.object({
				giscus: z.boolean().optional().default(true),
			}),
		}),
	}),
};
