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

		it("prefers `import` over `default` for esm-only registries", () => {
			const input = {
				exports: {
					".": {
						default: "./dist/index.cjs",
						import: "./dist/index.mjs",
					},
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({ ".": "./dist/index.mjs" });
		});

		it("falls back to custom conditions like `svelte` when no known runtime condition matches", () => {
			const input = {
				exports: {
					"./svelte/component": {
						svelte: "./frameworks/svelte/component.js",
						types: "./frameworks/svelte/component.d.ts",
					},
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({
				"./svelte/component": "./frameworks/svelte/component.js",
			});
		});

		it("treats a top-level conditions object with no `.` keys as the `.` entry", () => {
			const input = {
				exports: {
					import: "./dist/index.mjs",
					require: "./dist/index.cjs",
					types: "./dist/index.d.ts",
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({ ".": "./dist/index.mjs" });
		});

		it("falls back to a non-`types` condition when no known runtime condition matches", () => {
			const input = {
				exports: {
					"./deno-only": { deno: "./deno.mjs" },
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({
				"./deno-only": "./deno.mjs",
			});
		});

		it("skips entries that only publish a `types` declaration", () => {
			const input = {
				exports: {
					".": "./dist/index.mjs",
					"./client": { types: "./client.d.ts" },
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({ ".": "./dist/index.mjs" });
		});

		it("resolves nested conditional records recursively", () => {
			const input = {
				exports: {
					".": {
						node: { import: { default: "./dist/node.mjs" } },
					},
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({ ".": "./dist/node.mjs" });
		});

		it("accepts a plain string subpath value alongside conditional records", () => {
			const input = {
				exports: {
					".": "./dist/index.mjs",
					"./package.json": "./package.json",
					"./svelte": {
						default: "./frameworks/svelte/index.js",
						svelte: "./frameworks/svelte/component.js",
						types: "./frameworks/svelte/index.d.ts",
					},
				},
				name: "@scope/pkg",
				version: "1.0.0",
			};
			const result = jsrTransformer.parse(input);
			expect(result.exports).toEqual({
				".": "./dist/index.mjs",
				"./package.json": "./package.json",
				"./svelte": "./frameworks/svelte/index.js",
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
				tokenEnvironmentKey: "test",
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
				tokenEnvironmentKey: "test",
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
