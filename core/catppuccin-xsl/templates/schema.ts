import {
	createHandlebarSchemaMap,
	getFileContext,
	type HandlebarSchemaMapOptions,
} from "@stephansama/typed-templates";
import * as z from "zod";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

const catppuccinStyleSchema = z.looseObject({
	base: z.string(),
	blue: z.string(),
	green: z.string(),
	lavender: z.string(),
	mauve: z.string(),
	pink: z.string(),
	red: z.string(),
	teal: z.string(),
	text: z.string(),
	yellow: z.string(),
});

const themeStylesheet = {
	path: "./common/theme-stylesheet.css.hbs",
	schema: z.object({ darkStyle: z.string(), lightStyle: z.string() }),
} satisfies HandlebarSchemaMapOptions;

export const opmlSchema = createHandlebarSchemaMap(
	{
		markup: {
			path: "./opml/markup.xml.hbs",
			schema: z.object({ style: z.string() }),
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
				package_name: z.string(),
				theme: z.string(),
				version: z.string(),
				year: z.number(),
			}),
		},
		markup: {
			path: "./rss/markup.xml.hbs",
			schema: z.object({ comment: z.string(), style: z.string() }),
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
			schema: z.object({ style: z.string() }),
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
	await rssSchema.audit();
	await opmlSchema.audit();
	await sitemapSchema.audit();
}
