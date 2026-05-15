import * as icons from "simple-icons";

import { INFO } from "./log";

const alternateNames = {
	"@commitlint/cli": "commitlint",
	"@dotenvx/dotenvx": "dotenv",
	"@iconify/types": "iconify",
	"@tanstack/intent": "tanstack",
	"ai": "vercel",
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
	"turbo": "turborepo",
	/* cspell:disable-next-line */
	"vue": "vuedotjs",
} as const;

export function createSlugName(iconName: string) {
	iconName = iconName.toLowerCase();
	if (isAlternateName(iconName)) return alternateNames[iconName];
	return iconName.replaceAll("+", "plus").replaceAll("#", "sharp");
}

export function getSimpleIconColor(slug: string) {
	INFO(`checking ${slug} for simple icon color`);

	return icons[
		`si${slug.at(0)?.toUpperCase()}${slug.slice(1)}` as keyof typeof icons
	]?.hex.replace("#", "");
}

function isAlternateName(name: unknown): name is keyof typeof alternateNames {
	return Object.keys(alternateNames).includes(name as string);
}
