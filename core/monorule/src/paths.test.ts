import { describe, expect, it } from "vitest";

import { DEFAULT_IGNORE_LIST } from "./paths";

describe("paths", () => {
	describe("DEFAULT_IGNORE_LIST", () => {
		it("should contain the expected ignore globs", () => {
			expect(DEFAULT_IGNORE_LIST).toEqual([
				"**/.astro/**",
				"**/.next/**",
				"**/.nuxt/**",
				"**/.output/**",
				"**/.svelte-kit/**",
				"**/.svelte/**",
				"**/dist/**",
				"**/node_modules/**",
			]);
		});

		it("should ignore node_modules and dist", () => {
			expect(DEFAULT_IGNORE_LIST).toContain("**/node_modules/**");
			expect(DEFAULT_IGNORE_LIST).toContain("**/dist/**");
		});
	});
});
