import { afterEach, expect, it, vi } from "vitest";

import * as logger from "./log";
import * as module from "./utils";

const mocks = vi.hoisted(() => ({
	dirname: vi.fn(),
	execSync: vi.fn(),
	existsSync: vi.fn(),
	resolve: vi.fn(),
}));

vi.mock("node:child_process", () => ({ execSync: mocks.execSync }));
vi.mock("node:fs", () => ({ existsSync: mocks.existsSync }));
vi.mock("node:path", () => ({
	dirname: mocks.dirname,
	resolve: mocks.resolve,
}));

const mockGitRoot = "/Users/stephansama/Code/packages/";

afterEach(() => {
	vi.clearAllMocks();
});

it("logs an error when no staged files are found", () => {
	const errorSpy = vi.spyOn(logger, "ERROR");

	mocks.execSync.mockReturnValue("");

	module.findAffectedMarkdowns({});

	expect(errorSpy).toHaveBeenCalled();
});

it("logs additional affected regexes when supplied", () => {
	const infoSpy = vi.spyOn(logger, "INFO");

	mocks.execSync.mockReturnValue(
		["README.md", "package.json"].map((f) => mockGitRoot + f).join("\n"),
	);

	module.findAffectedMarkdowns({
		affectedRegexes: [".*\\/schema\\.js"],
	});

	expect(infoSpy).toHaveBeenCalledTimes(2);
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
