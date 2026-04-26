import * as cheerio from "cheerio";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { imports } from "./import-map";
import { img, link, script, svgUse } from "./inline";

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

describe("img", () => {
	it("inlines a PNG image as a base64 data URI", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer,
				contentType: "image/png",
			}),
		);

		const $ = cheerio.load('<img src="https://example.com/image.png">');
		await img($, "https://example.com");

		expect($("img").attr("src")).toMatch(/^data:image\/png;base64,/);
	});

	it("inlines a plain SVG (no fragment) as a base64 data URI", async () => {
		const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>`;
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: Buffer.from(svgContent).buffer as ArrayBuffer,
				contentType: "image/svg+xml",
			}),
		);

		const $ = cheerio.load('<img src="https://example.com/logo.svg">');
		await img($, "https://example.com");

		expect($("img").attr("src")).toMatch(/^data:image\/svg\+xml;base64,/);
	});

	it("inlines an SVG symbol fragment as a URL-encoded data URI", async () => {
		const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon" viewBox="0 0 24 24"><path d="M0 0"/></symbol></svg>`;
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: Buffer.from(svgContent).buffer as ArrayBuffer,
				contentType: "image/svg+xml",
			}),
		);

		const $ = cheerio.load(
			'<img src="https://example.com/icons.svg#icon">',
		);
		await img($, "https://example.com");

		expect($("img").attr("src")).toMatch(/^data:image\/svg\+xml,/);
	});

	it("skips img elements with a non-URL src", async () => {
		const $ = cheerio.load('<img src="not a valid url">');
		await img($, "https://example.com");

		expect($("img").attr("src")).toBe("not a valid url");
		expect(mockKy.get).not.toHaveBeenCalled();
	});
});

describe("link", () => {
	it("replaces a stylesheet link with an inline style tag", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/css",
				text: "body { color: red; }",
			}),
		);

		const $ = cheerio.load(
			'<link rel="stylesheet" href="https://example.com/style.css">',
		);
		await link($, "https://example.com");

		expect($("link").length).toBe(0);
		expect($("style").text()).toContain("body { color: red; }");
	});

	it("replaces a favicon href with a data URI", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: new Uint8Array([0, 1, 2]).buffer,
				contentType: "image/x-icon",
			}),
		);

		const $ = cheerio.load(
			'<link rel="icon" href="https://example.com/favicon.ico">',
		);
		await link($, "https://example.com");

		expect($("link").attr("href")).toMatch(/^data:/);
	});

	it("replaces an apple-touch-icon href with a data URI", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				buffer: new Uint8Array([0, 1, 2]).buffer,
				contentType: "image/png",
			}),
		);

		const $ = cheerio.load(
			'<link rel="apple-touch-icon" href="https://example.com/icon.png">',
		);
		await link($, "https://example.com");

		expect($("link").attr("href")).toMatch(/^data:/);
	});

	it("leaves unrecognized rel attributes unchanged", async () => {
		const $ = cheerio.load(
			'<link rel="preconnect" href="https://fonts.googleapis.com">',
		);
		await link($, "https://example.com");

		expect(mockKy.get).not.toHaveBeenCalled();
		expect($("link").attr("href")).toBe("https://fonts.googleapis.com");
	});

	it("skips link elements with a non-URL href", async () => {
		const $ = cheerio.load('<link rel="stylesheet" href="not a url">');
		await link($, "https://example.com");

		expect(mockKy.get).not.toHaveBeenCalled();
	});
});

describe("script", () => {
	it("inlines script content and removes the src attribute", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/javascript",
				text: "console.log('hello');",
			}),
		);

		const $ = cheerio.load(
			'<script src="https://example.com/app.js"></script>',
		);
		await script($, "https://example.com");

		expect($("script").attr("src")).toBeUndefined();
		expect($("script").text()).toContain("console.log('hello')");
	});

	it("rewrites static imports to use the import map", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/javascript",
				text: `import { foo } from "https://example.com/lib.js";\nfoo();`,
			}),
		);

		const $ = cheerio.load(
			'<script src="https://example.com/app.js"></script>',
		);
		await script($, "https://example.com");

		const content = $("script").text();
		expect(content).toContain(`window["imports"]`);
		expect(content).toContain("await import(");
		expect(content).not.toContain(`import { foo } from`);
	});

	it("rewrites dynamic imports to use the import map", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({
				contentType: "text/javascript",
				text: `const mod = import("https://example.com/lib.js");`,
			}),
		);

		const $ = cheerio.load(
			'<script src="https://example.com/app.js"></script>',
		);
		await script($, "https://example.com");

		expect($("script").text()).toContain(`window["imports"]`);
	});

	it("skips script elements with a non-URL src", async () => {
		const $ = cheerio.load('<script src="not a url"></script>');
		await script($, "https://example.com");

		expect(mockKy.get).not.toHaveBeenCalled();
		expect($("script").attr("src")).toBe("not a url");
	});
});

describe("svgUse", () => {
	const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon" viewBox="0 0 32 32"><rect width="32" height="32"/></symbol></svg>`;

	it("replaces the use element with symbol content and sets viewBox on the parent svg", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({ contentType: "image/svg+xml", text: svgSprite }),
		);

		const $ = cheerio.load(
			'<svg><use href="https://example.com/icons.svg#icon"></use></svg>',
		);
		await svgUse($, "https://example.com");

		expect($("use").length).toBe(0);
		expect($("svg").attr("viewBox")).toBe("0 0 32 32");
	});

	it("warns and skips use elements without a hash fragment", async () => {
		const $ = cheerio.load(
			'<svg><use href="https://example.com/icons.svg"></use></svg>',
		);
		await svgUse($, "https://example.com");

		expect(mockKy.get).not.toHaveBeenCalled();
		expect($("use").length).toBe(1);
	});

	it("throws when the referenced symbol is not found in the fetched SVG", async () => {
		mockKy.get.mockReturnValue(
			makeMockResponse({ contentType: "image/svg+xml", text: svgSprite }),
		);

		const $ = cheerio.load(
			'<svg><use href="https://example.com/icons.svg#missing"></use></svg>',
		);

		await expect(svgUse($, "https://example.com")).rejects.toThrow(
			"unable to parse parent",
		);
	});

	it("logs an error and skips use elements with a non-URL href", async () => {
		const $ = cheerio.load(
			'<svg><use href="not a valid url#icon"></use></svg>',
		);
		await svgUse($, "https://example.com");

		expect(mockKy.get).not.toHaveBeenCalled();
	});
});
