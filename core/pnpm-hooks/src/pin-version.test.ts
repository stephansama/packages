import { describe, expect, it } from "vitest";

import { pinVersion } from "./pin-version";

describe("pinVersion", () => {
	it.each([
		["^1.2.3", "1.2.3"],
		["~1.2.3", "1.2.3"],
		[">=1.2.3", "1.2.3"],
		["1.2.3 - 2.0.0", "1.2.3"],
		["npm:foo@^1.2.3", "npm:foo@1.2.3"],
	])("pins %s to %s", (input, expected) => {
		expect(pinVersion(input)).toBe(expected);
	});

	it.each(["*", "latest", "1.x", "^1.2", ">1.2.3", "^1.0.0 || ^2.0.0"])(
		"leaves %s unchanged",
		(input) => {
			expect(pinVersion(input)).toBe(input);
		},
	);
});
