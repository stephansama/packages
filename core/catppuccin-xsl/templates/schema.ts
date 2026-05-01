import {
	createHandlebarSchemaMap,
	getFileContext,
	type HandlebarSchemaMapOptions,
} from "@stephansama/typed-templates";
import * as z from "zod";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

const catppuccinStyleSchema = z.looseObject({
	base: z.string().trim(),
	blue: z.string().trim(),
	green: z.string().trim(),
	lavender: z.string().trim(),
	mauve: z.string().trim(),
	pink: z.string().trim(),
	red: z.string().trim(),
	teal: z.string().trim(),
	text: z.string().trim(),
	yellow: z.string().trim(),
});

const themeStylesheet = {
	path: "./common/theme-stylesheet.css.hbs",
	schema: z.object({
		darkStyle: z.string().trim(),
		lightStyle: z.string().trim(),
	}),
} satisfies HandlebarSchemaMapOptions;

export const opmlSchema = createHandlebarSchemaMap(
	{
		markup: {
			path: "./opml/markup.xml.hbs",
			schema: z.object({ style: z.string().trim() }),
		},
		style: { path: "./opml/style.css.hbs", schema: catppuccinStyleSchema },
		themeStylesheet,
	},
	{ templateDirectory },
);

export const rssSchema = createHandlebarSchemaMap(
	{
		comment: {
			path: "./rss/comment.hbs",
			schema: z.object({
				package_name: z.string().trim(),
				theme: z.string().trim(),
				version: z.string().trim(),
				year: z.number(),
			}),
		},
		markup: {
			path: "./rss/markup.xml.hbs",
			schema: z.object({
				comment: z.string().trim(),
				style: z.string().trim(),
			}),
		},
		style: { path: "./rss/style.css.hbs", schema: catppuccinStyleSchema },
		themeStylesheet,
	},
	{ templateDirectory },
);

export const sitemapSchema = createHandlebarSchemaMap(
	{
		markup: {
			path: "./sitemap/markup.xml.hbs",
			schema: z.object({ style: z.string().trim() }),
		},
		style: {
			path: "./sitemap/style.css.hbs",
			schema: catppuccinStyleSchema,
		},
		themeStylesheet,
	},
	{ templateDirectory },
);

if (isLinting()) {
	await Promise.all([
		rssSchema.audit(),
		opmlSchema.audit(),
		sitemapSchema.audit(),
	]);
}
