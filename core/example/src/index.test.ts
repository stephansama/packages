import { MockAgent, setGlobalDispatcher } from "undici";
import { describe, expect, it, vi } from "vitest";

import rootPkgJson from "../../../package.json";
import { main } from "./index.ts";

const mockPkgJson = { dependencies: { typescript: "^5.2.3", vite: "^7.2.3" } };

const mockAgent = new MockAgent();

setGlobalDispatcher(mockAgent);

const mockPool = mockAgent.get(rootPkgJson.homepage);

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
		mockPool
			.intercept({
				method: "GET",
				path: "/meta.json",
			})
			.reply(200, [
				{
					description: "Example astro site using iconify svgmap",
					name: "@example/astro-iconify-svgmap",
					relativeDir: "examples/astro-iconify-svgmap",
					version: "1.0.5",
				},
			]);

		await expect(main()).resolves.not.toThrow();
	});

	it("should use fallback examples ", async () => {
		mockPool
			.intercept({
				method: "GET",
				path: "/meta.json",
			})
			.reply(404);

		await expect(main()).resolves.not.toThrow();
	});
});
