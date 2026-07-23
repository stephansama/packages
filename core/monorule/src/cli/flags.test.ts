import { describe, expect, it } from "vitest";

import type { CliArguments } from "./arguments";

import { getFlag } from "./flags";

const makeArguments = (flags: Record<string, unknown>) =>
	({ flags }) as unknown as CliArguments;

describe("getFlag", () => {
	it("should return the flag value when present", () => {
		expect(getFlag(makeArguments({ verbose: 2 }), "verbose")).toBe(2);
	});

	it("should return undefined when the flag is absent", () => {
		expect(getFlag(makeArguments({}), "fix")).toBeUndefined();
	});
});
