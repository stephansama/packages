import * as z from "zod";

import { defineRule } from "@/src/rule";

export const jsonRule = defineRule({
	apply(input) {
		input.property = true;
		return input;
	},
	name: "json",
	parse(input: string) {
		return z
			.object({ property: z.boolean().optional() })
			.parse(JSON.parse(input));
	},
	pattern: "**/data/*.json",
	when(input) {
		console.info(input);
		return !("property" in input);
	},
});

export const txtRule = defineRule({
	apply(input) {
		return `stephansama${input}`;
	},
	name: "txt",
	parse: "txt",
	pattern: "**/data/*.txt",
	when(input) {
		return !input.includes("stephansama");
	},
});
