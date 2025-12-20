import { expect, it, vi } from "vitest";

vi.mock("node:fs/promises", async (importOriginal) => ({
	...(await importOriginal()),
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}));

it("./opml.ts", async () => {
	await expect(import("./opml.ts")).resolves.not.toThrow();
});

it("./rss.ts", async () => {
	await expect(import("./rss.ts")).resolves.not.toThrow();
});

it("./sitemap.ts", async () => {
	await expect(import("./sitemap.ts")).resolves.not.toThrow();
});
