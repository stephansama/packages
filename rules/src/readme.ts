import type { Error } from "@stephansama/monorule";

import { defineRule } from "@stephansama/monorule";

export const verifyPublishedPackageJson = defineRule({
	apply(input, context) {
		if (!context?.errors) return input;

		for (const error of context.errors) {
			switch (error.id) {
				case "heading_mismatch": {
					const lines = input.split("\n");
					const headingIndex = lines.findIndex((line) => line.startsWith("#"));
					const updatedHeading = `# [\`@stephansama\`](https://github.com/stephansama) / ${context?.closestPackage.json?.name.replace("@stephansama/", "")}`;
					lines.splice(headingIndex, 1, updatedHeading);
					input = lines.join("\n");
					break;
				}
				default: {
					throw new Error("error id not implemented");
				}
			}
		}

		return input;
	},
	errors: {
		heading_mismatch: "heading is not aligned with package",
		missing_heading: "missing heading from markdown",
	},
	include: "**/core/**/README.md",
	name: "verify-published-readmes",
	parse: "txt",
	when(input, context) {
		const errors = new Array<Error<keyof typeof this.errors>>();

		const lines = input.split("\n");
		const heading = lines.find((line) => line.startsWith("#"));

		if (!heading) errors.push({ id: "missing_heading" });

		if (
			heading &&
			heading !==
				`# [\`@stephansama\`](https://github.com/stephansama) / ${context?.closestPackage.json?.name.replace("@stephansama/", "")}`
		) {
			errors.push({ id: "heading_mismatch" });
		}

		return errors;
	},
});
