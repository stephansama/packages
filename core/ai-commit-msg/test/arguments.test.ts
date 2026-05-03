import { afterEach, describe, expect, it, vi } from "vitest";

import { parseArguments } from "../src/arguments";

describe("args", () => {
	const originalArgv = process.argv;

	afterEach(() => {
		process.argv = originalArgv;
		vi.clearAllMocks();
	});

	it("should parse basic args", async () => {
		process.argv = [
			"node",
			"script",
			"--config",
			"conf.json",
			"--output",
			"msg.txt",
			"--verbose",
		];
		const arguments_ = await parseArguments();
		expect(arguments_.config).toBe("conf.json");
		expect(arguments_.output).toBe("msg.txt");
		expect(arguments_.verbose).toBe(true);
	});

	it("should handle aliases", async () => {
		process.argv = [
			"node",
			"script",
			"-c",
			"conf.json",
			"-o",
			"msg.txt",
			"-v",
		];
		const arguments_ = await parseArguments();
		expect(arguments_.config).toBe("conf.json");
		expect(arguments_.output).toBe("msg.txt");
		expect(arguments_.verbose).toBe(true);
	});

	it("should handle missing optional args", async () => {
		process.argv = ["node", "script"];
		const arguments_ = await parseArguments();
		expect(arguments_.config).toBeUndefined();
		expect(arguments_.output).toBeUndefined();
		expect(arguments_.verbose).toBeUndefined();
	});
});
