import { describe, expect, it } from "vitest";

import type { CatalogSchema } from "./catalog.ts";

import { catalogSchema, loadVersion } from "./catalog.ts";

describe("catalog", () => {
	describe("catalogSchema", () => {
		it("should parse default catalog", () => {
			const input = {
				catalog: {
					react: "^18.0.0",
				},
			};
			const result = catalogSchema.parse(input);
			expect(result.catalog).toEqual(input.catalog);
		});

		it("should parse named catalogs", () => {
			const input = {
				catalogs: {
					react18: { react: "^18.0.0" },
					react19: { react: "^19.0.0" },
				},
			};
			const result = catalogSchema.parse(input);
			expect(result.catalogs).toEqual(input.catalogs);
		});
	});

	describe("loadVersion", () => {
		const catalogs: CatalogSchema = {
			catalog: {
				foo: "1.0.0",
			},
			catalogs: {
				legacy: {
					foo: "0.9.0",
				},
			},
		};

		it("should return version if not using catalog", () => {
			const result = loadVersion({
				catalogs,
				dependency: "foo",
				version: "^2.0.0",
			});
			expect(result).toBe("^2.0.0");
		});

		it("should resolve default catalog", () => {
			const result = loadVersion({
				catalogs,
				dependency: "foo",
				version: "catalog:",
			});
			expect(result).toBe("1.0.0");
		});

		it("should resolve named catalog", () => {
			const result = loadVersion({
				catalogs,
				dependency: "foo",
				version: "catalog:legacy",
			});
			expect(result).toBe("0.9.0");
		});

		it("should throw if catalog dependency not found", () => {
			expect(() => {
				loadVersion({
					catalogs,
					dependency: "bar",
					version: "catalog:",
				});
			}).toThrow();
		});

		it("should throw if named catalog not found", () => {
			expect(() => {
				loadVersion({
					catalogs,
					dependency: "foo",
					version: "catalog:missing",
				});
			}).toThrow();
		});
	});
});
