import * as fs from "node:fs/promises";
import * as url from "node:url";
import prettier from "prettier";
import { expect, it } from "vitest";
import plugin from "../src/index";

const tests = await fs.readdir(
	url.fileURLToPath(new URL("./fixtures/", import.meta.url)),
);

const cases = await Promise.all(
	tests.map(async (extension) => {
		const [inputFilepath, outputFilepath] = ["input", "output"].map(
			(filename) =>
				url.fileURLToPath(
					new URL(
						`./fixtures/${extension}/${filename}.${extension}.hbs`,
						import.meta.url,
					),
				),
		);
		const input = await fs.readFile(inputFilepath, { encoding: "utf8" });
		const output = await fs.readFile(outputFilepath, { encoding: "utf8" });
		return {
			extension,
			filepath: inputFilepath,
			input,
			output,
		};
	}),
);

it("exports the plugin module", () => {
	expect(plugin).toBeTruthy();
});

it.each(cases)(
	"formats $extension extensions properly",
	async ({ filepath, input, output }) => {
		const formatted = await prettier.format(input, {
			filepath,
			plugins: [new URL("../dist/index.js", import.meta.url).href],
		});

		expect(formatted).not.toEqual(input);
		expect(formatted).toEqual(output);
	},
);
