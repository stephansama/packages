import { describe, expect, it } from "vitest";

import { changesetStatusSchema } from "./release.ts";

describe("release", () => {
	describe("changesetStatusSchema", () => {
		it("should transform changeset status to releases", () => {
			const input = {
				changesets: [],
				releases: [
					{
						changesets: [],
						name: "pkg-a",
						newVersion: "1.0.1",
						oldVersion: "1.0.0",
						type: "patch",
					},
					{
						changesets: [],
						name: "pkg-b",
						newVersion: "2.1.0",
						oldVersion: "2.0.0",
						type: "minor",
					},
				],
			};

			const expected = [
				{ name: "pkg-a", version: "1.0.1" },
				{ name: "pkg-b", version: "2.1.0" },
			];

			const result = changesetStatusSchema.parse(input);
			expect(result).toEqual(expected);
		});
	});
});
