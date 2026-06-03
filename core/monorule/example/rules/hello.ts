import * as z from "zod";

import { defineRule } from "@/src";

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
		if (input.property) return;

		return [
			{
				id: "no_property",
				message: "failed to find property",
			},
		];
	},
});

export const txtRule = defineRule({
	apply(input) {
		return `stephansama${input}`;
	},
	name: "txt",
	parse: "txt",
	pattern: "**/data/*.txt",
	when() {
		// return !input.includes("stephansama");
	},
});
