import { expect, it, vi } from "vitest";

vi.mock("node:fs/promises", async (importOriginal) => ({
	...(await importOriginal()),
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}));

it("./opml.ts", async () => {
	await expect(import("./opml")).resolves.not.toThrow();
});

it("./rss.ts", async () => {
	await expect(import("./rss")).resolves.not.toThrow();
});

it("./sitemap.ts", async () => {
	await expect(import("./sitemap")).resolves.not.toThrow();
});
