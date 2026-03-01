import type { KnipConfig } from "knip";

export default {
	ignore: [
		"**/*.test.*",
		"**/.config/**",
		"**/build/**",
		"**/core/alfred-kaomoji/**",
		"**/dist/**",
		"**/example/**",
		"**/node_modules/**",
		"**/turbo/**",
	],
	workspaces: {
		core: {
			entry: ["src/index.{ts,tsx}"],
			project: ["src/**/*.{ts,tsx}"],
		},
		packages: {
			entry: ["src/index.{ts,tsx}"],
			project: ["src/**/*.{ts,tsx}"],
		},
	},
} as const satisfies KnipConfig;
