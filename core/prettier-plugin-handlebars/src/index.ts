import type { BuiltInParserName, Config, Plugin } from "prettier";

/** @see https://prettier.io/docs/plugins/#developing-plugins */

const parserMap = {
	css: "css",
	html: "html",
	js: "typescript",
	json: "json",
	jsonc: "jsonc",
	jsx: "typescript",
	md: "markdown",
	mdx: "mdx",
	scss: "scss",
	ts: "typescript",
	tsx: "typescript",
	vue: "vue",
	yaml: "yaml",
} satisfies Record<string, BuiltInParserName>;

const languages: Plugin["languages"] = Object.entries(parserMap).map(
	([extension, parser]) => ({
		extensions: [`.${extension}.hbs`],
		name: `Handlebars ${extension.toUpperCase()}`,
		parsers: [parser],
	}),
);

const overrides: Config["overrides"] = Object.entries(parserMap).map(
	([extension, parser]) => ({
		files: [`.${extension}.hbs`],
		options: { parser },
	}),
);

export default {
	languages,
	overrides,
} satisfies Config;
