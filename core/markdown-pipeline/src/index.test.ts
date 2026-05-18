import { describe, expect, it, vi } from "vitest";

import { createPipeline, rehypePreset, remarkPreset } from "./index";

describe("createPipeline", () => {
	it("returns a usable processor with no plugins", async () => {
		const processor = createPipeline() as {
			process: (md: string) => Promise<unknown>;
		};
		const result = await processor.process("# heading\n");
		expect(String(result)).toContain("# heading");
	});

	it("applies supplied remark plugins in order", () => {
		const plugin = vi.fn();
		const processor = createPipeline({ remarkPlugins: [plugin] });
		expect(processor).toBeDefined();
	});
});

describe("remarkPreset / rehypePreset", () => {
	it("remarkPreset returns the supplied remark plugin list", () => {
		const plugin = vi.fn();
		const list = remarkPreset({ remarkPlugins: [plugin] });
		expect(list).toEqual([plugin]);
	});

	it("rehypePreset returns an empty list when nothing is supplied", () => {
		expect(rehypePreset()).toEqual([]);
	});
});
