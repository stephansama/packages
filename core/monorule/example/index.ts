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
			errors: {
				id: "json has not been touched",
			},
			include: "**/data/*.json",
			name: "rule1",
			parse: (input: string) =>
				z
					.object({
						touched: z.boolean().optional(),
					})
					.loose()
					.parse(parsers.json(input)),
			when(input) {
				if (input.touched) return;
				return [{ id: "id", message: this.errors.id }];
			},
		}),
	],
});
