import * as ai from "ai";
import { err, ok } from "neverthrow";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { run } from "../src/index";

vi.mock("node:child_process");
vi.mock("node:fs/promises");

vi.mock("@dotenvx/dotenvx", () => ({
	default: { config: vi.fn() },
}));

vi.mock("ai", () => ({
	generateText: vi.fn(),
}));

vi.mock("../src/args", () => ({
	parseArgs: vi.fn(),
}));

vi.mock("../src/config", () => ({
	loadConfig: vi.fn(),
}));

vi.mock("../src/ai", () => ({
	getProvider: vi.fn(),
}));

import { getProvider } from "../src/ai";
import { parseArgs } from "../src/args";
import { loadConfig } from "../src/config";

describe("index run", () => {
	const mockExit = vi
		.spyOn(process, "exit")
		.mockImplementation((() => {}) as any);
	const mockConsoleError = vi
		.spyOn(console, "error")
		.mockImplementation(() => {});

	beforeEach(() => {
		(parseArgs as any).mockResolvedValue({ output: "COMMIT_EDITMSG" });
		(loadConfig as any).mockResolvedValue({
			model: "gemini",
			provider: "google",
		});
		(getProvider as any).mockReturnValue(ok({ type: "mock-model" }));
		(ai.generateText as any).mockResolvedValue({
			text: "feat: new feature",
		});
		(cp.execSync as any).mockReturnValue("diff content");

		mockExit.mockClear();
		mockConsoleError.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should run successfully and write commit message", async () => {
		await run();

		expect(parseArgs).toHaveBeenCalled();
		expect(loadConfig).toHaveBeenCalled();
		expect(getProvider).toHaveBeenCalledWith("google", "gemini");
		expect(ai.generateText).toHaveBeenCalledWith(
			expect.objectContaining({
				prompt: expect.stringContaining("diff content"),
			}),
		);
		expect(fsp.writeFile).toHaveBeenCalledWith(
			"COMMIT_EDITMSG",
			"feat: new feature",
		);
		expect(mockExit).not.toHaveBeenCalled();
	});

	it("should fetch COMMIT_EDITMSG if output arg is missing", async () => {
		(parseArgs as any).mockResolvedValue({}); // No output
		(cp.execSync as any).mockImplementation((cmd: string) => {
			if (cmd.includes("git rev-parse")) return "git/COMMIT_EDITMSG\n";
			if (cmd.includes("git diff")) return "diff";
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

		await run();

		expect(mockConsoleError).toHaveBeenCalledWith("Provider error");
		expect(mockExit).toHaveBeenCalledWith(1);
	});
});
