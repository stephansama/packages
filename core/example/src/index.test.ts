import { describe, expect, it, vi } from "vitest";

import { main } from "./index.ts";

const mockPkgJson = { dependencies: { typescript: "^5.2.3", vite: "^7.2.3" } };

vi.mock("node:fs", async (importActual) => ({
	...(await importActual()),
	readFileSync: vi.fn().mockReturnValue(JSON.stringify(mockPkgJson)),
	writeFileSync: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	isCancel: vi.fn().mockReturnValue(false),
	outro: vi.fn(),
	select: vi.fn().mockReturnValue("@example/remark-asciinema"),
	spinner: vi.fn().mockReturnValue({ start: vi.fn(), stop: vi.fn() }),
	text: vi.fn().mockReturnValue("./example"),
}));

vi.mock("@bluwy/giget-core", () => ({
	downloadTemplate: vi.fn().mockResolvedValue(""),
}));

describe("cli index", () => {
	it("should handle main", async () => {
		await expect(main()).resolves.not.toThrow();
	});
});
