import { afterEach, expect, it, vi } from "vitest";

import * as module from "./index";
import * as utils from "./utils";

const mocks = vi.hoisted(() => ({
	access: vi.fn().mockResolvedValue(true),
	execFileSync: vi.fn(),
	execSync: vi.fn(),
	parseArgs: vi.fn(),
	readFile: vi.fn(),
	writeFile: vi.fn(),
}));

vi.mock("node:child_process", () => ({
	execFileSync: mocks.execFileSync,
	execSync: mocks.execSync,
}));

vi.mock("node:fs/promises", () => ({
	access: mocks.access,
	readFile: mocks.readFile,
	writeFile: mocks.writeFile,
}));

vi.mock("./args", () => ({ parseArgs: mocks.parseArgs }));

const mockGitRoot = "/root";
const mockStagedFiles = ["file.md", "readme.md"].join("\n");
const mockFile = "file contents";

afterEach(() => {
	vi.clearAllMocks();
	vi.resetModules();
});

it("looks for affected files when flag is supplied", async () => {
	const findAffectedSpy = vi.spyOn(utils, "findAffectedMarkdowns");
	mocks.parseArgs.mockResolvedValueOnce({ changes: true });
	mocks.execSync.mockReturnValueOnce(mockGitRoot);
	mocks.execSync.mockReturnValueOnce(mockStagedFiles);

	await expect(module.run()).resolves.not.toThrow();
	expect(findAffectedSpy).toHaveBeenCalled();
});

it("adds affected files to git stage", async () => {
	mocks.parseArgs.mockResolvedValueOnce({ changes: true });
	mocks.execSync.mockReturnValueOnce(mockGitRoot);
	mocks.execSync.mockReturnValueOnce(mockStagedFiles);
	mocks.readFile.mockResolvedValueOnce(mockFile);
	await expect(module.run()).resolves.not.toThrow();
	expect(mocks.execFileSync).toHaveBeenCalledTimes(2);
});

it("runs without error", async () => {
	mocks.execSync.mockReturnValueOnce(mockGitRoot);
	mocks.parseArgs.mockResolvedValueOnce({ changes: false });
	await expect(module.run()).resolves.not.toThrow();
});
