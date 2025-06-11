import { remark } from "remark";
import { describe, expect, it } from "vitest";
import plugin from "../src/asciinema";

const testFile = `
# Heading

## Subheading

regular text

regular text with the word asciinema

regular text with the word asciinema.org
regular text with a link to https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg 

https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg
`;

describe("remark asciinema", () => {
	it("should replace link with embed script when no options are provided", async () => {
		const result = await remark().use(plugin).process(testFile);

		console.log(result);
		expect(result).toBeTruthy();
	});

	it("should replace link with embed script", async () => {
		const result = await remark()
			.use(plugin, { embedType: "script" })
			.process(testFile);

		console.log(result);
		expect(result).toBeTruthy();
	});

	it("should replace link with image", async () => {
		const result = await remark()
			.use(plugin, { embedType: "image" })
			.process(testFile);

		console.log(result);
		expect(result).toBeTruthy();
	});
});
