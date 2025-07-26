import { describe, expect, it, vi } from "vitest";

import { main } from "./index.ts";

vi.mock("node:fs", async (importActual) => ({
	...(await importActual()),
	readFileSync: vi.fn().mockReturnValue(
		JSON.stringify({
			dependencies: {
				typescript: "^5.2.3",
				vite: "^7.2.3",
			},
		}),
	),
	writeFileSync: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
	input: vi.fn().mockReturnValue("./example"),
	select: vi.fn().mockReturnValue("@example/remark-asciinema"),
}));

vi.mock("@bluwy/giget-core", () => ({
	downloadTemplate: vi.fn().mockResolvedValue(""),
}));

describe("cli index", () => {
	it("should handle main", async () => {
		await expect(main()).resolves.not.toThrow();
	});
});
