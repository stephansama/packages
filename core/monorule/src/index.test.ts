import { describe, expect, it } from "vitest";

import { defineConfig } from "./index";

describe("index", () => {
	describe("defineConfig", () => {
		it("should return the passed options unchanged", () => {
			const options = {
				ignorePaths: [],
				ignoreRules: [],
				ruleDirectory: "rules",
				rules: [],
			};
			expect(defineConfig(options)).toBe(options);
		});
	});
});
