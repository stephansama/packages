import { afterEach, expect, it, vi } from "vitest";

import * as logger from "./log";
import * as module from "./utils";

const mocks = vi.hoisted(() => ({
	access: vi.fn(),
	execSync: vi.fn(),
	existsSync: vi.fn(),
}));

vi.mock("node:child_process", () => ({ execSync: mocks.execSync }));
vi.mock("node:fs", () => ({ existsSync: mocks.existsSync }));
vi.mock("node:fs/promises", () => ({ access: mocks.access }));

const mockGitRoot = "/Users/stephansama/Code/packages/";

afterEach(vi.clearAllMocks);

it("checks if a file exists", async () => {
	const result = await module.fileExists(mockGitRoot + "README.md");
	expect(result).toBeTruthy();
});

it("checks if a file does not exist exists", async () => {
	mocks.access.mockRejectedValue("Does not exist");
	const result = await module.fileExists(mockGitRoot + "README.md");
	expect(result).toBeFalsy();
});

it("logs an error when no staged files are found", () => {
	const errorSpy = vi.spyOn(logger, "ERROR");

	mocks.execSync.mockReturnValue("");

	module.findAffectedMarkdowns(mockGitRoot, {});

	expect(errorSpy).toHaveBeenCalled();
});

it("logs additional affected regexes when supplied", () => {
	const infoSpy = vi.spyOn(logger, "INFO");

	mocks.execSync.mockReturnValue(
		["README.md", "package.json"].map((f) => mockGitRoot + f).join("\n"),
	);

	module.findAffectedMarkdowns(mockGitRoot, {
		affectedRegexes: [".*\\/schema\\.js"],
	});

	expect(infoSpy).toHaveBeenCalledTimes(4);
});

it("successfully returns git root", () => {
	const infoSpy = vi.spyOn(logger, "INFO");
	mocks.execSync.mockReturnValue(mockGitRoot);
	const root = module.getGitRoot();

	expect(root).toBeTruthy();
	expect(infoSpy).toHaveBeenCalled();
});

it("throws an error when no root is found", () => {
	mocks.execSync.mockReturnValue("");
	expect(module.getGitRoot).toThrowError();
});
