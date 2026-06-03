import * as z from "zod";

import { defineConfig, defineRule, parsers } from "../dist/index.mjs";

export default defineConfig({
	ignorePaths: [],
	ignoreRules: [],
	ruleDirectory: "./rules/",
	rules: [
		defineRule({
			apply(input) {
				input.touched = true;
				return input;
			},
			name: "rule1",
			parse(input: string) {
				return z
					.object({
						touched: z.boolean().optional(),
					})
					.loose()
					.parse(parsers.json(input));
			},
			pattern: "**/data/*.json",
			when(input) {
				if (input.touched) return;
				return [
					{
						id: "id",
						message: "json has not been touched",
					},
				];
			},
		}),
	],
});
