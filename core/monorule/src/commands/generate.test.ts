import { describe, expect, it } from "vitest";

import type { CliArguments } from "@/cli/arguments";

import { act, fileExists, meta } from "./generate";

describe("generate command", () => {
	describe("meta", () => {
		it("should be named generate", () => {
			expect(meta.options.name).toBe("generate");
		});
	});

	describe("fileExists", () => {
		it("should return true for an existing file", async () => {
			expect(await fileExists(process.execPath)).toBe(true);
		});

		it("should return false for a missing file", async () => {
			expect(await fileExists("/no/such/file/xyz-123")).toBe(false);
		});
	});

	describe("act", () => {
		it("should resolve without throwing", async () => {
			const arguments_ = {
				flags: { help: false },
			} as unknown as CliArguments;
			await expect(act(arguments_)).resolves.toBeUndefined();
		});
	});
});
