import { describe, expect, it } from "vitest";
import { parseDocument } from "yaml";

import {
	add,
	applySyncProposal,
	list,
	remove,
	sync,
	update,
} from "../src/anchors";

const SAMPLE = `__versions:
  - &vitest 4.1.0

catalogs:
  vitest:
    vitest: *vitest
    "@vitest/ui": *vitest
  alpine:
    alpinejs: 3.15.8
    "@alpinejs/focus": 3.15.8
`;

describe("anchors", () => {
	it("lists existing anchor entries", () => {
		const document = parseDocument(SAMPLE);
		expect(list(document)).toEqual([{ name: "vitest", value: "4.1.0" }]);
	});

	it("adds a new anchor to __versions", () => {
		const document = parseDocument(SAMPLE);
		const result = add(document, "alpine", "3.15.8");
		expect(result.added).toBe(true);
		expect(list(document)).toContainEqual({
			name: "alpine",
			value: "3.15.8",
		});
	});

	it("returns added=false when the anchor already exists", () => {
		const document = parseDocument(SAMPLE);
		expect(add(document, "vitest", "4.2.0").added).toBe(false);
	});

	it("updates the scalar value of an existing anchor", () => {
		const document = parseDocument(SAMPLE);
		const result = update(document, "vitest", "4.2.0");
		expect(result.updated).toBe(true);
		expect(document.toString()).toContain("&vitest 4.2.0");
	});

	it("refuses to remove an anchor with dangling aliases", () => {
		const document = parseDocument(SAMPLE);
		const result = remove(document, "vitest");
		expect(result.removed).toBe(false);
		expect(result.dangling.length).toBeGreaterThan(0);
	});

	it("force-removes by inlining aliases with literal values", () => {
		const document = parseDocument(SAMPLE);
		const result = remove(document, "vitest", { force: true });
		expect(result.removed).toBe(true);
		const output = document.toString();
		expect(output).not.toContain("&vitest");
		expect(output).not.toContain("*vitest");
		expect(output).toContain("vitest: 4.1.0");
	});

	it("detects repeated catalog versions via sync", () => {
		const document = parseDocument(SAMPLE);
		const proposals = sync(document);
		expect(proposals).toEqual([
			expect.objectContaining({
				anchorName: "alpine",
				catalog: "alpine",
				version: "3.15.8",
			}),
		]);
	});

	it("applySyncProposal writes the anchor and replaces literals with aliases", () => {
		const document = parseDocument(SAMPLE);
		applySyncProposal(document, {
			anchorName: "alpine",
			catalog: "alpine",
			keys: ["alpinejs", "@alpinejs/focus"],
			version: "3.15.8",
		});
		const output = document.toString();
		expect(output).toContain("&alpine 3.15.8");
		expect(output).toContain("alpinejs: *alpine");
	});

	it("round-trips: serializing a document with existing aliases preserves them", () => {
		const document = parseDocument(SAMPLE);
		const output = document.toString();
		expect(output).toContain("&vitest");
		expect(output).toContain("*vitest");
	});
});
