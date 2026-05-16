import * as icons from "simple-icons";

import { INFO } from "./log";

const colorMapOverride = {
	"@tanstack/ai": "#f6339a",
	"@tanstack/devtools": "#62748e",
	"@tanstack/hotkeys": "#ec003f",
	"@tanstack/intent": "#00a6f4",
	"@tanstack/start": "#00b8db",
	"@tanstack/table-core": "#2b7fff",
	"@tanstack/virtual": "#ad46ff",
	"handlebars": "#d46926",
	"tsdown": "#3178C6",
} as const satisfies Partial<
	Record<keyof typeof icons | (string & {}), string>
>;

const alternateNames = {
	"@commitlint/cli": "commitlint",
	"@dotenvx/dotenvx": "dotenv",
	"@iconify/types": "iconify",
	"@tanstack/intent": "tanstack",
	"ai": "vercel",
	"alfy": "alfred",
	"c#": "sharp",
	"dockerfile": "docker",
	"handlebars": "handlebarsdotjs",
	"html": "html5",
	"java": "oracle",
	"jupyter notebook": "jupyter",
	"liquid": "shopify",
	"makefile": "cmake",
	/* cspell:disable-next-line */
	"next": "nextdotjs",
	/* cspell:disable-next-line */
	"nuxt": "nuxtdotjs",
	"oxc-parser": "oxc",
	"scss": "sass",
	"tsdown": "rolldown",
	"turbo": "turborepo",
	/* cspell:disable-next-line */
	"vue": "vuedotjs",
} as const;

export function createSlugName(iconName: string) {
	iconName = iconName.toLowerCase();
	if (isAlternateName(iconName)) return alternateNames[iconName];
	return iconName
		.replaceAll("+", "plus")
		.replaceAll("#", "sharp")
		.replaceAll("-", "");
}

export function getSimpleIconColor(name: string) {
	INFO(`checking ${name} for simple icon color`);

	const slug = createSlugName(name);

	const colorOverride = colorMapOverride[
		name as keyof typeof colorMapOverride
	]?.replace("#", "");

	if (colorOverride) {
		return [colorOverride, slug];
	}

	const capitalizedSlug = slug
		.split("-")
		.map((word) => capitalize(word))
		.join("");

	return [
		icons[
			`si${capitalize(capitalizedSlug)}` as keyof typeof icons
		]?.hex.replace("#", ""),
		slug,
	];
}

function capitalize(word: string) {
	return word.at(0)?.toUpperCase() + word.slice(1);
}

function isAlternateName(name: unknown): name is keyof typeof alternateNames {
	return typeof name === "string" && name in alternateNames;
}
