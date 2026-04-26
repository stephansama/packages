import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	determineImportType,
	imports,
	loadImport,
	writeImportMap,
} from "./import-map";

const mockKy = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("ky", () => ({ default: mockKy }));

function makeMockResponse(opts: {
	buffer?: ArrayBuffer;
	contentType?: null | string;
	text?: string;
}) {
	return {
		arrayBuffer: vi
			.fn()
			.mockResolvedValue(opts.buffer ?? new ArrayBuffer(0)),
		headers: { get: vi.fn().mockReturnValue(opts.contentType ?? null) },
		text: vi.fn().mockResolvedValue(opts.text ?? ""),
	};
}

beforeEach(() => {
	imports.clear();
});

afterEach(vi.clearAllMocks);

describe("determineImportType", () => {
	it.each([
		["application/javascript", "js"],
		["text/javascript", "js"],
		["application/ecmascript", "js"],
		["text/ecmascript", "js"],
	] as const)("%s → %s", (contentType, expected) => {
		expect(determineImportType(contentType)).toBe(expected);
	});

	it("returns unknown for text/css", () => {
		expect(determineImportType("text/css")).toBe("unknown");
	});

	it("returns unknown for null", () => {
		expect(determineImportType(null)).toBe("unknown");
	});

	it("returns unknown for undefined", () => {
		expect(determineImportType(undefined)).toBe("unknown");
	});
});

describe("loadImport", () => {
	it("loads text content and stores it in the imports map", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/javascript",
				text: "console.log('hi')",
			}),
		);

		const result = await loadImport({ file: "https://example.com/app.js" });

		expect(result).toBe("console.log('hi')");
		const cached = imports.get("https://example.com/app.js");
		expect(cached?.type).toBe("js");
		expect(cached?.data).toBe("console.log('hi')");
	});

	it("loads binary content when isBinary is true", async () => {
		const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
		mockKy.get.mockReturnValue(
			makeMockResponse({ buffer, contentType: "image/png" }),
		);

		const result = await loadImport({
			file: "https://example.com/img.png",
			isBinary: true,
		});

		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(imports.get("https://example.com/img.png")?.type).toBe("binary");
	});

	it("returns cached text without making a second HTTP request", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/javascript",
				text: "cached",
			}),
		);

		await loadImport({ file: "https://example.com/lib.js" });
		await loadImport({ file: "https://example.com/lib.js" });

		expect(mockKy.get).toHaveBeenCalledTimes(1);
	});

	it("returns cached binary without making a second HTTP request", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: new ArrayBuffer(4),
				contentType: "image/png",
			}),
		);

		await loadImport({
			file: "https://example.com/img.png",
			isBinary: true,
		});
		await loadImport({
			file: "https://example.com/img.png",
			isBinary: true,
		});

		expect(mockKy.get).toHaveBeenCalledTimes(1);
	});

	it("joins dirname with file when dirname is provided", async () => {
		mockKy.get.mockReturnValue(makeMockResponse({ text: "body" }));

		await loadImport({ dirname: "/assets", file: "script.js" });

		expect(mockKy.get).toHaveBeenCalledWith("/assets/script.js");
	});
});

describe("writeImportMap", () => {
	it("returns an empty registry when there are no JS imports", async () => {
		imports.set("https://example.com/style.css", {
			contentType: "text/css",
			data: "body {}",
			type: "unknown",
		});

		const result = await writeImportMap();

		expect(result).toContain("<script");
		expect(result).toContain("window.registry");
		expect(result).not.toContain("URL.createObjectURL");
	});

	it("includes JS entries as URL.createObjectURL blobs", async () => {
		imports.set("https://example.com/lib.js", {
			contentType: "text/javascript",
			data: "export const x = 1;",
			type: "js",
		});

		const result = await writeImportMap();

		expect(result).toContain("https://example.com/lib.js");
		expect(result).toContain("URL.createObjectURL");
	});

	it("escapes special characters in JS content", async () => {
		imports.set("https://example.com/tmpl.js", {
			contentType: "text/javascript",
			data: "const x = `${y}`;",
			type: "js",
		});

		const result = await writeImportMap();

		expect(result).not.toContain("`${y}`");
		expect(result).toContain("\\${y}");
	});

	it("excludes non-JS imports from the registry", async () => {
		imports.set("https://example.com/img.png", {
			contentType: "image/png",
			data: new ArrayBuffer(4),
			type: "binary",
		});

		const result = await writeImportMap();

		expect(result).not.toContain("img.png");
	});
});
