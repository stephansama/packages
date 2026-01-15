import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs/promises")>();
	return {
		...mod,
		writeFile: vi.fn(),
	};
});


import type { CatalogSchema } from "./catalog";

import { catalogSchema, loadVersion } from "./catalog";

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

	describe("updatePackageJsonWithCatalog", () => {
		it("should update package.json for pnpm", async () => {
			const fsp = await import("node:fs/promises");
			const { updatePackageJsonWithCatalog, catalogLoadMap } = await import(
				"./catalog"
			);

			vi.spyOn(catalogLoadMap, "pnpm").mockResolvedValue({
				catalog: {
					foo: "1.0.0",
				},
			});

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					dependencies: {
						foo: "catalog:",
					},
				},
			} as any;

			await updatePackageJsonWithCatalog(pkg, "pnpm");

			expect(fsp.writeFile).toHaveBeenCalledWith(
				"/path/to/pkg/package.json",
				JSON.stringify(
					{
						dependencies: {
							foo: "1.0.0",
						},
					},
					undefined,
					2,
				),
			);
		});
	});
});
