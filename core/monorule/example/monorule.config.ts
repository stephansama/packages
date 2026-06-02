import { defineConfig, defineRule } from "../dist/index.mjs";

export default defineConfig({
	ignorePaths: [],
	ignoreRules: [],
	ruleDirectory: "./rules/",
	rules: [
		// @ts-expect-error still developing
		defineRule({
			apply(input) {
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
