import { describe, expect, it } from "vitest";

import type { JsrSchema } from "./jsr";
import type { JsrPlatformOptionsSchema } from "./schema";

import {
	includeExportDirectories,
	jsrSchema,
	jsrTransformer,
	updateIncludeExcludeList,
} from "./jsr";

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

			expect(jsrConfig.publish).toEqual({
				exclude: ["test"],
				include: ["src"],
			});
			expect(jsrConfig.include).toBeUndefined();
			expect(jsrConfig.exclude).toBeUndefined();
		});

		it("should merge with existing publish include/exclude", () => {
			const jsrConfig: JsrSchema = {
				exclude: ["top-level-exclude"],
				exports: "./index.ts",
				name: "@scope/pkg",
				publish: {
					exclude: ["existing-exclude"],
					include: ["existing-include"],
				},
				version: "1.0.0",
			};
			const appConfig: JsrPlatformOptionsSchema = {
				allowSlowTypes: true,
				defaultExclude: ["new-exclude", "existing-exclude"],
				defaultInclude: ["new-include"],
				experimentalGenerateJSR: false,
				experimentalUpdateCatalogs: false,
				tokenEnvironmentKey: "test",
			};

			updateIncludeExcludeList(jsrConfig, appConfig);

			expect(jsrConfig.publish).toEqual({
				exclude: ["existing-exclude", "new-exclude"],
				include: ["existing-include", "new-include"],
			});
			expect(jsrConfig.exclude).toEqual(["top-level-exclude"]);
		});

		it("should not add a publish block when there is nothing to add", () => {
			const jsrConfig: JsrSchema = {
				exports: "./index.ts",
				name: "@scope/pkg",
				version: "1.0.0",
			};

			updateIncludeExcludeList(jsrConfig, {
				allowSlowTypes: true,
				experimentalGenerateJSR: false,
				experimentalUpdateCatalogs: false,
				tokenEnvironmentKey: "test",
			});

			expect(jsrConfig.publish).toBeUndefined();
		});
	});

	describe("includeExportDirectories", () => {
		const base = { name: "@scope/pkg", version: "1.0.0" };

		it("should un-exclude the directory of a string export", () => {
			const jsrConfig: JsrSchema = {
				...base,
				exports: "./dist/index.mjs",
			};
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish?.exclude).toEqual(["!dist"]);
		});

		it("should un-exclude each directory of a record export once", () => {
			const jsrConfig: JsrSchema = {
				...base,
				exports: {
					".": "./dist/index.mjs",
					"./cli": "./dist/cli.mjs",
					"./schema.json": "./schema/schema.json",
				},
			};
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish?.exclude).toEqual(["!dist", "!schema"]);
		});

		it("should only use the top-level directory of nested paths", () => {
			const jsrConfig: JsrSchema = {
				...base,
				exports: { ".": "dist/esm/index.mjs" },
			};
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish?.exclude).toEqual(["!dist"]);
		});

		it("should skip exports at the package root", () => {
			const jsrConfig: JsrSchema = { ...base, exports: "./index.ts" };
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish).toBeUndefined();
		});

		it("should put the directories before existing excludes, which jsr matches last-wins", () => {
			const jsrConfig: JsrSchema = {
				...base,
				exports: "./dist/index.mjs",
				publish: { exclude: ["dist/**/*.map", "!config"] },
			};
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish?.exclude).toEqual([
				"!dist",
				"dist/**/*.map",
				"!config",
			]);
		});

		it("should keep a directory that's already listed where it is", () => {
			const jsrConfig: JsrSchema = {
				...base,
				exports: "./dist/index.mjs",
				publish: { exclude: ["dist/internal", "!dist"] },
			};
			includeExportDirectories(jsrConfig);
			expect(jsrConfig.publish?.exclude).toEqual([
				"dist/internal",
				"!dist",
			]);
		});
	});

	describe("jsrSchema", () => {
		it("should keep a user's publish block", () => {
			const config = jsrSchema.parse({
				exports: "./dist/index.mjs",
				name: "@scope/pkg",
				publish: { exclude: ["!dist"], include: ["dist", "README.md"] },
				version: "1.0.0",
			});
			expect(config.publish).toEqual({
				exclude: ["!dist"],
				include: ["dist", "README.md"],
			});
		});
	});
});
