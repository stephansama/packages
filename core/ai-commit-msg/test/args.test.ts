import { afterEach, describe, expect, it, vi } from "vitest";

import { parseArgs } from "../src/args";

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
		const args = await parseArgs();
		expect(args.config).toBe("conf.json");
		expect(args.output).toBe("msg.txt");
		expect(args.verbose).toBe(true);
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
		const args = await parseArgs();
		expect(args.config).toBe("conf.json");
		expect(args.output).toBe("msg.txt");
		expect(args.verbose).toBe(true);
	});

	it("should handle missing optional args", async () => {
		process.argv = ["node", "script"];
		const args = await parseArgs();
		expect(args.config).toBeUndefined();
		expect(args.output).toBeUndefined();
		expect(args.verbose).toBeUndefined();
	});
});
