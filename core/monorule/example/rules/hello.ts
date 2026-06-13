import * as z from "zod";

import { defineRule } from "~/src";

export const jsonRule = defineRule({
	apply(input) {
		input.property = true;
		return input;
	},
	errors: {
		no_property: "failed to find property",
	},
	include: ["**/data/*.json"],
	name: "json",
	parse: (input: string) =>
		z.object({ property: z.boolean().optional() }).parse(JSON.parse(input)),
	when(input) {
		if (input.property) return;

		return [{ id: "no_property", message: this.errors.no_property }];
	},
});

export const txtRule = defineRule({
	apply(input) {
		return `stephansama${input}`;
	},
	errors: {},
	include: ["**/data/*.txt"],
	name: "txt",
	parse: "txt",
	when() {
		// return !input.includes("stephansama");
	},
});
