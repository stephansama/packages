export function negate(input: Array<string> | string) {
	if (typeof input === "string") return `!${input}`;
	return input.map((current) => `!${current}`);
}

export const CSS = "**/*.css" as const;

export const NODE_MODULES = "node_modules" as const;

export const MD = "**/*.md" as const;

export const ASTRO = "**/*.astro" as const;

export const JS = "**/*.?([cm])js" as const;
export const JSX = "**/*.jsx" as const;

export const TS = "**/*.?([cm])ts" as const;
export const TSX = "**/*.tsx" as const;

export const SVELTE = ["**/*.svelte", "**/*.svelte.js", "**/*.svelte.ts"];

export const ROOT_PKG_JSON = "package.json" as const;
export const PKG_JSON = `**/${ROOT_PKG_JSON}` as const;
export const ALL_PKG_JSON = [ROOT_PKG_JSON, PKG_JSON];

export const AI_EXCLUDES = [
	"**/.context",
	"**/.claude",
	"**/.agents",
	"**/.*/skills",
] as const;

export const EXCLUDES = [
	"**/node_modules",
	"**/dist",
	"**/package-lock.json",
	"**/yarn.lock",
	"**/pnpm-lock.yaml",
	"**/bun.lockb",

	"**/output",
	"**/fixtures",
	"**/coverage",
	"**/temp",
	"**/.temp",
	"**/tmp",
	"**/.tmp",
	"**/.history",
	"**/.vitepress/cache",
	"**/.nuxt",
	"**/.next",
	"**/.svelte-kit",
	"**/.vercel",
	"**/.changeset",
	"**/.idea",
	"**/.cache",
	"**/.output",
	"**/.vite-inspect",
	"**/.yarn",

	"**/CHANGELOG*.md",
	"**/LICENSE*",
	"**/*.min.*",
	"**/__snapshots__",

	// Tools temp files
	"**/vite.config.*.timestamp-*",
	"**/auto-import?(s).d.ts",
	"**/components.d.ts",

	...AI_EXCLUDES,
];
