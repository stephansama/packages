import { afterEach, expect, it, vi } from "vitest";

import * as logger from "../log";
import * as module from "./index";

const mockGitRoot = "/Users/stephansama/Code/packages/";

const mocks = vi.hoisted(() => ({
	// eslint-disable-next-line unicorn/no-useless-undefined
	access: vi.fn().mockResolvedValue(undefined),
	execSync: vi.fn(),
	existsSync: vi.fn(),
	glob: vi.fn(),
	isSymbolicLink: vi.fn(),
	lstat: vi.fn(() => ({ isSymbolicLink: mocks.isSymbolicLink })),
	readlink: vi.fn(),
}));

vi.mock("node:child_process", () => ({ execSync: mocks.execSync }));
vi.mock("node:fs", () => ({ existsSync: mocks.existsSync }));
vi.mock("tinyglobby", () => ({ glob: mocks.glob }));
vi.mock("node:fs/promises", () => ({
	access: mocks.access,
	lstat: mocks.lstat,
	readlink: mocks.readlink,
}));

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
		affectedRegexes: [String.raw`.*\/schema\.js`],
	});

	expect(infoSpy).toHaveBeenCalledTimes(4);
});

it("skips affected readmes matching ignoreGlobs", () => {
	mocks.execSync.mockReturnValue(
		["examples/demo/package.json", "core/pkg/package.json"]
			.map((f) => mockGitRoot + f)
			.join("\n"),
	);
	mocks.existsSync.mockReturnValue(true);

	const readmes = module.findAffectedMarkdowns(mockGitRoot, {
		ignoreGlobs: ["examples/**"],
	});

	expect(readmes).toEqual([
		mockGitRoot + "core/pkg/README.md",
		mockGitRoot + "README.md",
	]);
});

it("matches files relative to the root against ignoreGlobs", () => {
	const config = { ignoreGlobs: ["examples/**", "CHANGELOG.md"] };

	expect(
		module.isIgnored(
			mockGitRoot,
			mockGitRoot + "examples/a/README.md",
			config,
		),
	).toBe(true);
	expect(
		module.isIgnored(mockGitRoot, mockGitRoot + "CHANGELOG.md", config),
	).toBe(true);
	expect(
		module.isIgnored(mockGitRoot, mockGitRoot + "core/README.md", config),
	).toBe(false);
	expect(module.isIgnored(mockGitRoot, mockGitRoot + "README.md", {})).toBe(
		false,
	);
});

it("treats bare directory ignoreGlobs like tinyglobby", () => {
	for (const glob of ["examples", "examples/"]) {
		const config = { ignoreGlobs: [glob] };

		expect(
			module.isIgnored(
				mockGitRoot,
				mockGitRoot + "examples/a/README.md",
				config,
			),
		).toBe(true);
		expect(
			module.isIgnored(
				mockGitRoot,
				mockGitRoot + "examplesX/README.md",
				config,
			),
		).toBe(false);
	}
});

it("passes ignoreGlobs to tinyglobby alongside node_modules", async () => {
	mocks.glob.mockResolvedValue(["README.md", "core/pkg/README.md"]);

	const paths = await module.getMarkdownPaths(mockGitRoot, {
		ignoreGlobs: ["examples/**"],
		onlyReadmes: true,
	});

	expect(mocks.glob).toHaveBeenCalledWith("**/README.md", {
		cwd: mockGitRoot,
		ignore: ["**/node_modules/**", "examples/**"],
	});
	expect(paths).toEqual([
		mockGitRoot + "README.md",
		mockGitRoot + "core/pkg/README.md",
	]);
});

it("globs every markdown file when onlyReadmes is disabled", async () => {
	mocks.glob.mockResolvedValue([]);

	await module.getMarkdownPaths(mockGitRoot, {});

	expect(mocks.glob).toHaveBeenCalledWith("**/*.md", {
		cwd: mockGitRoot,
		ignore: ["**/node_modules/**"],
	});
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

it("successfully resolves symbolic links for prettier", async () => {
	mocks.isSymbolicLink.mockReturnValueOnce(false);
	mocks.isSymbolicLink.mockReturnValueOnce(true);
	mocks.readlink.mockReturnValueOnce("../../docs/auto-readme.md");
	const input = [
		"/Users/stephansama/Code/packages/README.md",
		"/Users/stephansama/Code/packages/core/auto-readme/README.md",
	];
	const response = await module.getPrettierPaths(input);
	const expected = [
		"/Users/stephansama/Code/packages/README.md",
		"/Users/stephansama/Code/packages/docs/auto-readme.md",
	];
	expect(response).toStrictEqual(expected);
});
