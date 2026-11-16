import { describe, expect, it } from "vitest";

import { resolveOptions, UsageError } from "./run";

const tty = { env: {}, isTTY: true };
const piped = { env: {}, isTTY: false };

describe("resolveOptions", () => {
	it("picks table on a TTY and tsv when piped", () => {
		expect(resolveOptions({}, undefined, tty).format).toBe("table");
		expect(resolveOptions({}, undefined, piped).format).toBe("tsv");
	});

	it("uses the shorthands", () => {
		expect(resolveOptions({ list: true }, undefined, tty).format).toBe(
			"list",
		);
		expect(resolveOptions({ csv: true }, undefined, tty).format).toBe(
			"csv",
		);
		expect(resolveOptions({ json: true }, undefined, tty).format).toBe(
			"json",
		);
		expect(
			resolveOptions({ format: "ndjson" }, undefined, tty).format,
		).toBe("jsonl");
	});

	it("rejects conflicting formats", () => {
		expect(() =>
			resolveOptions({ csv: true, format: "json" }, undefined, tty),
		).toThrow(UsageError);
	});

	it("infers the format from --output", () => {
		const format = (output: string) =>
			resolveOptions({ output }, undefined, tty).format;

		expect(format("floating.csv")).toBe("csv");
		expect(format("floating.TSV")).toBe("tsv");
		expect(format("floating.json")).toBe("json");
		expect(format("floating.jsonl")).toBe("jsonl");
		expect(format("floating.md")).toBe("markdown");
		expect(format("floating")).toBe("tsv");
		expect(
			resolveOptions({ format: "json", output: "x.csv" }, undefined, tty)
				.format,
		).toBe("json");
	});

	it("never colors piped output, files, --no-color or NO_COLOR", () => {
		expect(resolveOptions({}, undefined, piped).color).toBe(false);
		expect(resolveOptions({ output: "x.txt" }, undefined, tty).color).toBe(
			false,
		);
		expect(resolveOptions({ noColor: true }, undefined, tty).color).toBe(
			false,
		);
		expect(
			resolveOptions({}, undefined, {
				env: { NO_COLOR: "1" },
				isTTY: true,
			}).color,
		).toBe(false);
	});

	it("defaults dep types to runtime dependencies", () => {
		expect(resolveOptions({}, undefined, tty).depTypes).toEqual([
			"dependencies",
			"optionalDependencies",
		]);
		expect(
			resolveOptions({ depTypes: ["all"] }, undefined, tty).depTypes,
		).toHaveLength(4);
	});

	it("splits comma-separated and repeated values", () => {
		const options = resolveOptions(
			{ failOn: ["wildcard"], kind: ["wildcard,tag", "caret"] },
			undefined,
			tty,
		);
		expect(options.kinds).toEqual(["wildcard", "tag", "caret"]);
		expect(options.failOn).toEqual(["wildcard"]);
	});

	it("rejects unknown values", () => {
		expect(() =>
			resolveOptions({ kind: ["nope"] }, undefined, tty),
		).toThrow(UsageError);
		expect(() => resolveOptions({ format: "xml" }, undefined, tty)).toThrow(
			UsageError,
		);
		expect(() =>
			resolveOptions({ fields: ["nope"] }, undefined, tty),
		).toThrow(UsageError);
		expect(() => resolveOptions({ sort: "nope" }, undefined, tty)).toThrow(
			UsageError,
		);
	});
});
