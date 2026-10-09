import * as fsp from "node:fs/promises";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
	buildPrompt,
	cleanMessage,
	isEmptyMessage,
	readExistingMessage,
} from "../src/message";

vi.mock("node:fs/promises");

describe("message", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("cleanMessage", () => {
		it("should strip comment lines", () => {
			expect(
				cleanMessage(
					"fix: thing\n\nbody\n# Please enter the commit message\n",
				),
			).toBe("fix: thing\n\nbody");
		});

		it("should drop everything after the scissors line", () => {
			const message = [
				"add feature",
				"# ------------------------ >8 ------------------------",
				"diff --git a/file b/file",
			].join("\n");

			expect(cleanMessage(message)).toBe("add feature");
		});
	});

	describe("isEmptyMessage", () => {
		it.each([
			"",
			"   ",
			"\n",
			"N/A",
			"n/a",
			"NA",
			"na",
			"n.a.",
			"N / A",
			"none",
			"-",
			".",
		])("should treat %j as empty", (message) => {
			expect(isEmptyMessage(message)).toBe(true);
		});

		it.each(["fix bug", "update nav", "wip"])(
			"should treat %j as meaningful",
			(message) => {
				expect(isEmptyMessage(message)).toBe(false);
			},
		);
	});

	describe("readExistingMessage", () => {
		it("should return the cleaned message", async () => {
			vi.mocked(fsp.readFile).mockResolvedValue("fix bug\n# comment\n");

			await expect(readExistingMessage("COMMIT_EDITMSG")).resolves.toBe(
				"fix bug",
			);
		});

		it("should return undefined for placeholder messages", async () => {
			vi.mocked(fsp.readFile).mockResolvedValue("n/a\n");

			await expect(
				readExistingMessage("COMMIT_EDITMSG"),
			).resolves.toBeUndefined();
		});

		it("should return undefined when the file is missing", async () => {
			vi.mocked(fsp.readFile).mockRejectedValue(new Error("ENOENT"));

			await expect(
				readExistingMessage("COMMIT_EDITMSG"),
			).resolves.toBeUndefined();
		});
	});

	describe("buildPrompt", () => {
		it("should only substitute the diff when there is no message", () => {
			expect(buildPrompt("prompt {{diff}}", "the diff")).toBe(
				"prompt the diff",
			);
		});

		it("should append intent instructions when there is a message", () => {
			const prompt = buildPrompt(
				"prompt {{diff}}",
				"the diff",
				"fix bug",
			);

			expect(prompt.startsWith("prompt the diff\n\n")).toBe(true);
			expect(prompt).toContain("use it as the source of intent");
			expect(prompt.endsWith("fix bug")).toBe(true);
		});

		it("should substitute a {{message}} placeholder", () => {
			expect(
				buildPrompt("{{message}} | {{diff}}", "the diff", "fix bug"),
			).toBe("fix bug | the diff");
		});

		it("should not substitute placeholders found inside the diff", () => {
			expect(
				buildPrompt("{{diff}}", "a {{message}} $& b", "fix bug"),
			).toContain("a {{message}} $& b");
		});

		it("should blank a {{message}} placeholder with no message", () => {
			expect(buildPrompt("[{{message}}] {{diff}}", "the diff")).toBe(
				"[] the diff",
			);
		});
	});
});
