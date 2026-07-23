import { describe, expect, it } from "vitest";

import { parse, parsers, stringifiers, stringify } from "./parse";

describe("parse", () => {
	describe("parse()", () => {
		it("should parse each builtin format", () => {
			expect(parse('{"a":1}', "json")).toEqual({ a: 1 });
			expect(parse("a = 1", "toml")).toEqual({ a: 1 });
			expect(parse("a: 1", "yaml")).toEqual({ a: 1 });
			expect(parse("hello", "txt")).toBe("hello");
		});

		it("should call a function formatter directly", () => {
			expect(parse("hi", (input: string) => input.toUpperCase())).toBe(
				"HI",
			);
		});

		it("should throw for an unknown format", () => {
			expect(() => parse("x", "xml" as unknown as "json")).toThrow(
				"unable to find formatter for parsing",
			);
		});
	});

	describe("stringify()", () => {
		it("should stringify each builtin format", () => {
			expect(stringify({ a: 1 }, "json")).toBe('{"a":1}');
			expect(stringify({ a: 1 }, "toml")).toContain("a = 1");
			expect(stringify({ a: 1 }, "yaml")).toBe("a: 1\n");
			expect(stringify("hello", "txt")).toBe("hello");
		});

		it("should default to json when the format is falsy", () => {
			expect(stringify({ a: 1 }, "" as unknown as "json")).toBe(
				'{"a":1}',
			);
		});

		it("should throw for an unknown format", () => {
			expect(() => stringify({}, "xml" as unknown as "json")).toThrow(
				"unable to find formatter for stringifier xml",
			);
		});
	});

	describe("parsers/stringifiers", () => {
		it("should pass through txt unchanged", () => {
			expect(parsers.txt("raw")).toBe("raw");
			expect(stringifiers.txt("raw")).toBe("raw");
		});
	});
});
