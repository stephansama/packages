/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call */
import * as ai from "@tanstack/ai";
import { err, ok } from "neverthrow";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { run } from "../src/index";

vi.mock("node:child_process");
vi.mock("node:fs/promises");

vi.mock("@dotenvx/dotenvx", () => ({
	config: vi.fn(),
}));

vi.mock("@tanstack/ai", () => ({
	chat: vi.fn(),
}));

vi.mock("../src/arguments", () => ({
	parseArguments: vi.fn(),
}));

vi.mock("../src/config", () => ({
	loadConfig: vi.fn(),
}));

vi.mock("../src/ai", () => ({
	getProvider: vi.fn(),
}));

import { getProvider } from "../src/ai";
import { parseArguments } from "../src/arguments";
import { loadConfig } from "../src/config";

function getPrompt(): string {
	return (ai.chat as any).mock.calls[0][0].messages[0].content;
}

describe("index run", () => {
	const mockExit = vi
		.spyOn(process, "exit")
		.mockImplementation((() => {}) as any);
	const mockConsoleError = vi
		.spyOn(console, "error")
		.mockImplementation(() => {});
	const mockConsoleWarn = vi
		.spyOn(console, "warn")
		.mockImplementation(() => {});

	beforeEach(() => {
		(parseArguments as any).mockResolvedValue({ output: "COMMIT_EDITMSG" });
		(loadConfig as any).mockResolvedValue({
			model: "gemini",
			prompt: "example prompt {{diff}}",
			provider: "google",
		});
		(getProvider as any).mockReturnValue(ok({ type: "mock-model" }));
		(ai.chat as any).mockResolvedValue("feat: new feature");
		(cp.execSync as any).mockReturnValue("diff content");
		(fsp.readFile as any).mockResolvedValue("");

		mockExit.mockClear();
		mockConsoleError.mockClear();
		mockConsoleWarn.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should run successfully and write commit message", async () => {
		await run();

		expect(parseArguments).toHaveBeenCalled();
		expect(loadConfig).toHaveBeenCalled();
		expect(getProvider).toHaveBeenCalledWith("google", "gemini");
		expect(ai.chat).toHaveBeenCalledWith(
			expect.objectContaining({
				adapter: { type: "mock-model" },
				stream: false,
			}),
		);
		expect(getPrompt()).toContain("diff content");
		expect(fsp.writeFile).toHaveBeenCalledWith(
			"COMMIT_EDITMSG",
			"feat: new feature",
		);
		expect(mockExit).not.toHaveBeenCalled();
	});

	it("should preserve the intent of an existing commit message", async () => {
		(fsp.readFile as any).mockResolvedValue(
			"fix login redirect\n# Please enter the commit message\n",
		);

		await run();

		expect(fsp.readFile).toHaveBeenCalledWith("COMMIT_EDITMSG", "utf8");
		expect(getPrompt()).toContain("fix login redirect");
	});

	it("should ignore an n/a commit message", async () => {
		(fsp.readFile as any).mockResolvedValue("N/A\n");

		await run();

		expect(getPrompt()).toBe("example prompt diff content");
	});

	it("should fetch COMMIT_EDITMSG if output arg is missing", async () => {
		(parseArguments as any).mockResolvedValue({}); // No output
		(cp.execSync as any).mockImplementation((cmd: string) => {
			if (cmd.includes("git rev-parse")) return "git/COMMIT_EDITMSG\n";
			if (cmd.includes("diff")) return "diff";
			return "";
		});

		await run();

		expect(cp.execSync).toHaveBeenCalledWith(
			expect.stringContaining("git rev-parse"),
			expect.anything(),
		);
		expect(fsp.writeFile).toHaveBeenCalledWith(
			"git/COMMIT_EDITMSG",
			"feat: new feature",
		);
	});

	it("should exit if provider initialization fails", async () => {
		(getProvider as any).mockReturnValue(err(new Error("Provider error")));

		await expect(run()).rejects.toThrowError();
	});

	it("should skip run if skipNextRun is true", async () => {
		(loadConfig as any).mockResolvedValue({
			skipNextRun: true,
		});

		await run();

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			"skipNextRun flag supplied skipping current run",
		);
		expect(ai.chat).not.toHaveBeenCalled();
	});
});
