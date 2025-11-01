import type { KnipConfig } from "knip";

const config: KnipConfig = {
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
};

export default config;
