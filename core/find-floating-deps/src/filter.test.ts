import { describe, expect, it } from "vitest";

import { filterFindings, sortFindings } from "./filter";
import { fixtureFindings } from "./findings.fixture";

const dependencies = (findings: { dependency: string }[]) =>
	findings.map((finding) => finding.dependency);

describe("filterFindings", () => {
	it("keeps everything without options", () => {
		expect(filterFindings(fixtureFindings, {})).toHaveLength(3);
	});

	it("keeps only the given kinds", () => {
		const result = filterFindings(fixtureFindings, {
			kinds: ["wildcard", "union"],
		});
		expect(dependencies(result)).toEqual(["@types/node", "react"]);
	});

	it("excludes by dependency or parent glob", () => {
		expect(
			dependencies(
				filterFindings(fixtureFindings, { exclude: ["@types/*"] }),
			),
		).toEqual(["picocolors", "react"]);
		expect(
			dependencies(
				filterFindings(fixtureFindings, { exclude: ["vite"] }),
			),
		).toEqual(["@types/node", "react"]);
	});

	it("includes by dependency or parent glob", () => {
		expect(
			dependencies(
				filterFindings(fixtureFindings, { include: ["vite", "re*"] }),
			),
		).toEqual(["picocolors", "react"]);
	});
});

describe("sortFindings", () => {
	it("sorts by dependency by default", () => {
		expect(
			dependencies(sortFindings(fixtureFindings.toReversed())),
		).toEqual(["@types/node", "picocolors", "react"]);
	});

	it("sorts by another field", () => {
		expect(
			sortFindings(fixtureFindings, "parent").map(
				(finding) => finding.parent,
			),
		).toEqual(["@types/ws", "needs,quoting", "vite"]);
	});
});
