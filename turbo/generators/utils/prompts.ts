import type { PlopTypes } from "@turbo/gen";

export const name = {
	message: "What is the name of the new package?",
	name: "name",
	type: "input",
	validate(input: string) {
		if (input.includes(".")) {
			return "library name cannot include an extension";
		}
		if (input.includes(" ")) {
			return "library name cannot include spaces";
		}
		if (!input) {
			return "library name is required";
		}
		return true;
	},
} as const satisfies PlopTypes.PromptQuestion;

export const description = {
	message: "What is the description of the new package?",
	name: "description",
	type: "input",
} as const satisfies PlopTypes.PromptQuestion;
