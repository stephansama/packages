import { merge } from "es-toolkit/compat";
import * as path from "node:path";
import { describe, expect, it, vi } from "vitest";

import * as catalog from "./catalog";

const mocks = vi.hoisted(() => ({
	catalogLoadMap: { bun: vi.fn(), pnpm: vi.fn() },
	writeFile: vi.fn(),
}));

vi.mock("./catalog", async (importOriginal) => {
	const mod = await importOriginal<typeof import("./catalog")>();
	return { ...mod, catalogLoadMap: mocks.catalogLoadMap };
});

vi.mock("node:fs/promises", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs/promises")>();
	return { ...mod, writeFile: mocks.writeFile };
});

describe("catalog", () => {
	describe("catalogSchema", () => {
		it("should parse default catalog", () => {
			const input = {
				catalog: {
					react: "^18.0.0",
				},
			};
			const result = catalog.catalogSchema.parse(input);
			expect(result.catalog).toEqual(input.catalog);
		});

		it("should parse named catalogs", () => {
			const input = {
				catalogs: {
					react18: { react: "^18.0.0" },
					react19: { react: "^19.0.0" },
				},
			};
			const result = catalog.catalogSchema.parse(input);
			expect(result.catalogs).toEqual(input.catalogs);
		});
	});

	describe("loadVersion", () => {
		const catalogs: catalog.CatalogSchema = {
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
			const result = catalog.loadVersion({
				catalogs,
				dependency: "foo",
				version: "^2.0.0",
			});
			expect(result).toBe("^2.0.0");
		});

		it("should resolve default catalog", () => {
			const result = catalog.loadVersion({
				catalogs,
				dependency: "foo",
				version: "catalog:",
			});
			expect(result).toBe("1.0.0");
		});

		it("should resolve named catalog", () => {
			const result = catalog.loadVersion({
				catalogs,
				dependency: "foo",
				version: "catalog:legacy",
			});
			expect(result).toBe("0.9.0");
		});

		it("should throw if catalog dependency not found", () => {
			expect(() => {
				catalog.loadVersion({
					catalogs,
					dependency: "bar",
					version: "catalog:",
				});
			}).toThrow();
		});

		it("should throw if named catalog not found", () => {
			expect(() => {
				catalog.loadVersion({
					catalogs,
					dependency: "foo",
					version: "catalog:missing",
				});
			}).toThrow();
		});
	});

	describe("updatePackageJsonWithCatalog", () => {
		it("should update package.json for pnpm", async () => {
			const mockDefaultCatalog = {
				foo: "1.0.0",
			};

			const packageManager = "pnpm" as const;

			mocks.catalogLoadMap[packageManager].mockResolvedValue({
				catalog: mockDefaultCatalog,
			});

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					dependencies: {
						foo: "catalog:",
					},
					name: "example",
					version: "0.0.0",
				},
				relativeDir: "./pkg",
			};

			const output = merge(pkg.packageJson, {
				dependencies: {
					foo: mockDefaultCatalog.foo,
				},
			});

			await catalog.updatePackageJsonWithCatalog(pkg, packageManager);

			expect(mocks.writeFile).toHaveBeenCalledWith(
				path.join(pkg.dir, "package.json"),
				JSON.stringify(output, undefined, 2),
			);
		});
	});
});
