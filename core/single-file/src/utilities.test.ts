/* eslint-disable e18e/prefer-static-regex */
import { describe, expect, it } from "vitest";

import {
	bufferToDataUri,
	escapeScript,
	isProbablyUrl,
	isUrl,
} from "./utilities";

describe("bufferToDataUri", () => {
	it("defaults to image/png mime type", () => {
		const result = bufferToDataUri(new Uint8Array([1, 2, 3]).buffer);
		expect(result).toMatch(/^data:image\/png;base64,/);
	});

	it("defaults to image/png when mime is null", () => {
		const result = bufferToDataUri(new Uint8Array([1, 2, 3]).buffer);
		expect(result).toMatch(/^data:image\/png;base64,/);
	});

	it("uses the provided mime type", () => {
		const result = bufferToDataUri(
			new Uint8Array([1]).buffer,
			"image/svg+xml",
		);
		expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
	});

	it("encodes buffer content as base64", () => {
		// "hello" in ASCII bytes — use Uint8Array to avoid Node Buffer shared pool
		const bytes = new Uint8Array([104, 101, 108, 108, 111]);
		const result = bufferToDataUri(bytes.buffer);
		expect(result).toBe("data:image/png;base64,aGVsbG8=");
	});

	it("handles empty buffer", () => {
		const result = bufferToDataUri(new ArrayBuffer(0));
		expect(result).toBe("data:image/png;base64,");
	});
});

describe("escapeScript", () => {
	it("escapes backslashes", () => {
		expect(escapeScript(String.raw`a\b`)).toBe(String.raw`a\\b`);
	});

	it("escapes backticks", () => {
		expect(escapeScript("`foo`")).toBe("\\`foo\\`");
	});

	it("escapes template literal expressions", () => {
		expect(escapeScript("${x}")).toBe("\\${x}");
	});

	it("escapes opening script tags", () => {
		expect(escapeScript("<script")).toBe(String.raw`<\x73cript`);
	});

	it("escapes closing script tags", () => {
		expect(escapeScript("</script>")).toBe(String.raw`<\/script>`);
	});

	it(String.raw`converts newlines to \n literal`, () => {
		expect(escapeScript("a\nb")).toBe(String.raw`a\nb`);
	});

	it("removes carriage returns", () => {
		expect(escapeScript("a\r\nb")).toBe(String.raw`a\nb`);
	});

	it("handles multiple replacements in one string", () => {
		const input = "const x = `${y}`;\n</script>";
		const result = escapeScript(input);
		// backtick is escaped (preceded by backslash)
		expect(result).toContain("\\`");
		expect(result).not.toMatch(/(?<!\\)`/);
		// template expression is escaped
		expect(result).toContain("\\${y}");
		// newline is replaced with \n literal
		expect(result).not.toContain("\n");
		// closing script tag is escaped
		expect(result).not.toContain("</script>");
		expect(result).toContain(String.raw`<\/script>`);
	});
});

describe("isProbablyUrl", () => {
	it("returns false for empty string", () => {
		expect(isProbablyUrl("")).toBe(false);
	});

	it("returns false for string containing only a newline", () => {
		expect(isProbablyUrl("\n")).toBe(false);
	});

	it("returns false for opening brace", () => {
		expect(isProbablyUrl("{")).toBe(false);
	});

	it("returns true for https URL", () => {
		expect(isProbablyUrl("https://example.com/script.js")).toBe(true);
	});

	it("returns true for http URL", () => {
		expect(isProbablyUrl("http://example.com/img.png")).toBe(true);
	});

	it("returns true for root-relative path", () => {
		expect(isProbablyUrl("/assets/style.css")).toBe(true);
	});

	it("returns true for ./ relative path", () => {
		expect(isProbablyUrl("./foo.js")).toBe(true);
	});

	it("returns true for ../ parent-relative path", () => {
		expect(isProbablyUrl("../foo.js")).toBe(true);
	});

	it("returns true for bare filename", () => {
		expect(isProbablyUrl("foo.js")).toBe(true);
	});
});

describe("isUrl", () => {
	const base = "https://example.com";

	it("returns the resolved href for an absolute URL", () => {
		expect(isUrl("https://cdn.example.com/style.css", base)).toBe(
			"https://cdn.example.com/style.css",
		);
	});

	it("resolves a root-relative URL against the base", () => {
		expect(isUrl("/style.css", base)).toBe("https://example.com/style.css");
	});

	it("resolves a ./ relative URL against the base", () => {
		expect(isUrl("./script.js", base)).toBe(
			"https://example.com/script.js",
		);
	});

	it("returns false when isProbablyUrl fails", () => {
		expect(isUrl("\n", base)).toBe(false);
	});

	it("returns false when the URL cannot be resolved against the base", () => {
		expect(isUrl("foo.js", "not-a-valid-base")).toBe(false);
	});
});
