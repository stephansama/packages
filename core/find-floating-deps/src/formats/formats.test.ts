import { describe, expect, it } from "vitest";

import { fixtureFindings } from "../findings.fixture";
import { formatters } from "../format";

describe.each(Object.entries(formatters))("%s", (name, formatter) => {
	it("formats the fixture findings", () => {
		expect(formatter(fixtureFindings)).toMatchSnapshot();
	});

	it("formats no findings", () => {
		expect(formatter([])).toMatchSnapshot();
	});

	if (
		"csv" === name ||
		"markdown" === name ||
		"table" === name ||
		"tsv" === name
	) {
		it("respects --fields and --no-header", () => {
			expect(
				formatter(fixtureFindings, {
					fields: ["dependency", "spec", "parent"],
					header: false,
				}),
			).toMatchSnapshot();
		});
	}
});

describe("csv", () => {
	it("quotes values with commas and doubles embedded quotes", () => {
		const output = formatters.csv(fixtureFindings, {
			fields: ["parent", "spec"],
			header: false,
		});
		expect(output.split("\r\n")[2]).toBe('"needs,quoting","^18 || ""19"""');
	});
});

describe("markdown", () => {
	it("escapes pipes", () => {
		expect(formatters.markdown(fixtureFindings)).toContain(
			String.raw`^18 \|\| "19"`,
		);
	});
});

describe("table", () => {
	it("adds ANSI colors only when asked", () => {
		expect(formatters.table(fixtureFindings)).not.toContain("\u001B[");
		expect(formatters.table(fixtureFindings, { color: true })).toContain(
			"\u001B[",
		);
	});
});

describe("list", () => {
	it("prints each dependency once", () => {
		expect(formatters.list([...fixtureFindings, ...fixtureFindings])).toBe(
			"@types/node\npicocolors\nreact\n",
		);
	});
});
