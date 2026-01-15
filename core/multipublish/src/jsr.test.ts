import { describe, expect, it } from "vitest";

import type { JsrSchema } from "./jsr";
import type { JsrPlatformOptionsSchema } from "./schema";

import { jsrTransformer, updateIncludeExcludeList } from "./jsr";

describe("jsr", () => {
	describe("jsrTransformer", () => {
		it("should transform simple exports", () => {
			const input = {
				exports: "./index.js",
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toBe("./index.js");
		});

		it("should transform complex exports", () => {
			const input = {
				exports: {
					".": {
						import: { default: "./index.js" },
						require: { default: "./index.cjs" },
					},
					"./foo": "./foo.js",
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({
				".": "./index.js",
				"./foo": "./foo.js",
			});
		});
	});

	describe("updateIncludeExcludeList", () => {
		it("should add default include/exclude", () => {
			const jsrConfig: JsrSchema = {
				exports: "./index.ts",
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const appConfig: JsrPlatformOptionsSchema = {
				allowSlowTypes: true,
				defaultExclude: ["test"],
				defaultInclude: ["src"],
				experimentalGenerateJSR: false,
				experimentalUpdateCatalogs: false,
			};

			updateIncludeExcludeList(jsrConfig, appConfig);

			expect(jsrConfig.include).toEqual(["src"]);
			expect(jsrConfig.exclude).toEqual(["test"]);
		});

		it("should merge with existing include/exclude", () => {
			const jsrConfig: JsrSchema = {
				exclude: ["existing-exclude"],
				exports: "./index.ts",
				include: ["existing-include"],
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const appConfig: JsrPlatformOptionsSchema = {
				allowSlowTypes: true,
				defaultExclude: ["new-exclude"],
				defaultInclude: ["new-include"],
				experimentalGenerateJSR: false,
				experimentalUpdateCatalogs: false,
			};

			updateIncludeExcludeList(jsrConfig, appConfig);

			expect(jsrConfig.include).toEqual([
				"existing-include",
				"new-include",
			]);
			expect(jsrConfig.exclude).toEqual([
				"existing-exclude",
				"new-exclude",
			]);
		});
	});
});
