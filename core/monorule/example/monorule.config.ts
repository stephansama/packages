import { defineConfig, defineRule } from "../dist/index.mjs";

export default defineConfig({
	ignorePaths: [],
	ignoreRules: [],
	ruleDirectory: "./rules/",
	rules: [
		defineRule({
			apply(input) {
				// @ts-expect-error touching
				input.touched = true;
				return input;
			},
			name: "rule1",
			parse: "json",
			pattern: "**/data/*.json",
			when(input) {
				return !!input;
			},
		}),
	],
});
