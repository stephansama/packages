import { describe, expect, it, vi } from "vitest";

import pkgRemarkAsciinema from "../../remark-asciinema/package.json";
import { convertDependencies, main } from "./index.ts";

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

vi.mock("latest-version", () => ({
	default: vi.fn().mockReturnValue(pkgRemarkAsciinema.version),
}));

vi.mock("@inquirer/prompts", () => ({
	input: vi.fn().mockReturnValue("./example"),
	select: vi.fn().mockReturnValue("@example/remark-asciinema"),
}));

vi.mock("@bluwy/giget-core", () => ({
	downloadTemplate: vi.fn().mockResolvedValue(""),
}));

describe("cli index", () => {
	it.each([
		[
			{
				"@stephansama/remark-asciinema": "workspace:*",
				"vite": "5.2.3",
			},
			{
				"@stephansama/remark-asciinema": pkgRemarkAsciinema.version,
				"vite": "5.2.3",
			},
		],
		[null, {}],
		[undefined, {}],
	])("should convert dependencies", async (input, expected) => {
		const newDependencies = await convertDependencies(input);
		expect(newDependencies).toStrictEqual(expected);
	});

	it("should handle main", async () => {
		await expect(main()).resolves.not.toThrow();
	});
});
