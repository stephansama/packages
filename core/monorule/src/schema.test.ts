import { describe, expect, it } from "vitest";

import {
	builtinParseEnumSchema,
	configSchema,
	errorSchema,
	errorValueSchema,
	fullConfigSchema,
	ruleSchema,
} from "./schema";

describe("schema", () => {
	describe("builtinParseEnumSchema", () => {
		it("should accept the builtin formats", () => {
			for (const format of ["json", "txt", "yaml", "toml"]) {
				expect(builtinParseEnumSchema.parse(format)).toBe(format);
			}
		});

		it("should reject unknown formats", () => {
			expect(builtinParseEnumSchema.safeParse("xml").success).toBe(false);
		});
	});

	describe("errorValueSchema", () => {
		it("should trim a string value", () => {
			expect(errorValueSchema.parse("  boom  ")).toBe("boom");
		});

		it("should accept an object value", () => {
			expect(
				errorValueSchema.parse({ fixable: true, message: "boom" }),
			).toEqual({ fixable: true, message: "boom" });
		});
	});

	describe("errorSchema", () => {
		it("should trim id and message", () => {
			expect(
				errorSchema.parse({ id: "  e  ", message: "  m  " }),
			).toEqual({
				id: "e",
				message: "m",
			});
		});
	});

	describe("configSchema", () => {
		it("should apply defaults", () => {
			expect(configSchema.parse({})).toEqual({
				ignorePaths: [],
				ignoreRules: [],
				ruleDirectory: "rules",
			});
		});

		it("should trim ruleDirectory", () => {
			expect(configSchema.parse({ ruleDirectory: "  custom  " })).toEqual(
				{
					ignorePaths: [],
					ignoreRules: [],
					ruleDirectory: "custom",
				},
			);
		});
	});

	describe("fullConfigSchema", () => {
		it("should default rules to an empty array", () => {
			expect(fullConfigSchema.parse({}).rules).toEqual([]);
		});
	});

	describe("ruleSchema", () => {
		const validRule = {
			include: "**/*.json",
			name: "my-rule",
			parse: "json",
			when: () => {},
		};

		it("should apply enabled and errors defaults", () => {
			const result = ruleSchema.parse(validRule);
			expect(result.enabled).toBe(true);
			expect(result.errors).toEqual({});
		});

		it("should trim name and accept an array include", () => {
			const result = ruleSchema.parse({
				...validRule,
				include: ["  a  ", "  b  "],
				name: "  spaced  ",
			});
			expect(result.name).toBe("spaced");
			expect(result.include).toEqual(["a", "b"]);
		});

		it("should accept a function parser", () => {
			expect(
				ruleSchema.safeParse({
					...validRule,
					parse: (index: string) => index,
				}).success,
			).toBe(true);
		});

		it("should reject a non-function where a function is required", () => {
			const result = ruleSchema.safeParse({ ...validRule, when: "nope" });
			expect(result.success).toBe(false);
			expect(JSON.stringify(result.error)).toContain(
				"must be a function",
			);
		});

		it("should reject a parse that is neither function nor builtin", () => {
			expect(
				ruleSchema.safeParse({ ...validRule, parse: 123 }).success,
			).toBe(false);
		});

		it("should reject when required fields are missing", () => {
			expect(ruleSchema.safeParse({}).success).toBe(false);
		});
	});
});
