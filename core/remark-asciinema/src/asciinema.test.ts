import { remark } from "remark";
import { describe, expect, it } from "vitest";

import plugin from "../src/index";

const testFile = `
# Heading

## Subheading

regular text

regular text with the word asciinema

regular text with the word asciinema.org
regular text with a link to https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg 

[https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg](https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg)
`;

const testOutput = `# Heading

## Subheading

regular text

regular text with the word asciinema

regular text with the word asciinema.org
regular text with a link to https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg

<script async="true" id="asciicast-ddUZ6Icj09rgjrqhprGccnRyg" src="https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg.js"></script>
`;

const testImgOutput = `# Heading

## Subheading

regular text

regular text with the word asciinema

regular text with the word asciinema.org
regular text with a link to https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg


		<a href="https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg" target="_blank" rel="noreferrer">
			<img src="https://asciinema.org/a/ddUZ6Icj09rgjrqhprGccnRyg.svg" />
		</a>
	
`;

describe("remark asciinema", () => {
	it("should replace link with embed script when no options are provided", async () => {
		const result = await remark().use(plugin).process(testFile);
		const rString = result.toString();

		expect(rString).toBe(testOutput);
	});

	it("should replace link with embed script", async () => {
		const result = await remark()
			.use(plugin, { embedType: "script" })
			.process(testFile);

		const rString = result.toString();

		expect(rString).toBe(testOutput);
	});

	it("should replace link with image", async () => {
		const result = await remark()
			.use(plugin, { embedType: "image" })
			.process(testFile);

		const rString = result.toString();

		expect(rString).toBe(testImgOutput);
	});
});
