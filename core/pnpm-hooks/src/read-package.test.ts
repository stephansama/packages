import type { HookContext } from "@pnpm/hooks.pnpmfile";
import type { BaseManifest } from "@pnpm/types";

import { describe, expect, it } from "vitest";

import { pinAllDependencies } from "./read-package";

const context = {} as HookContext;

describe("read-package", () => {
	describe("pinAllDependencies", () => {
		it("should remove ^ prefix from dependencies", () => {
			const pkg = { dependencies: { react: "^18.0.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.react).toBe("18.0.0");
		});

		it("should remove ~ prefix from dependencies", () => {
			const pkg = { dependencies: { lodash: "~4.17.21" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.lodash).toBe("4.17.21");
		});

		it("should leave versions without a prefix unchanged", () => {
			const pkg = { dependencies: { typescript: "5.4.5" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.typescript).toBe("5.4.5");
		});

		it("should remove ^ prefix from devDependencies", () => {
			const pkg = { devDependencies: { vitest: "^4.0.18" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.devDependencies?.vitest).toBe("4.0.18");
		});

		it("should remove ~ prefix from devDependencies", () => {
			const pkg = { devDependencies: { prettier: "~3.2.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.devDependencies?.prettier).toBe("3.2.0");
		});

		it("should remove ^ prefix from optionalDependencies", () => {
			const pkg = { optionalDependencies: { fsevents: "^2.3.3" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.optionalDependencies?.fsevents).toBe("2.3.3");
		});

		it("should remove ~ prefix from optionalDependencies", () => {
			const pkg = { optionalDependencies: { sharp: "~0.33.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.optionalDependencies?.sharp).toBe("0.33.0");
		});

		it("should skip processing when dependencies is undefined", () => {
			const pkg: BaseManifest = {
				devDependencies: { tsdown: "^0.21.0" },
			};
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies).toBeUndefined();
			expect(result.devDependencies?.tsdown).toBe("0.21.0");
		});

		it("should skip processing when devDependencies is undefined", () => {
			const pkg: BaseManifest = { dependencies: { react: "^18.0.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.devDependencies).toBeUndefined();
			expect(result.dependencies?.react).toBe("18.0.0");
		});

		it("should skip processing when optionalDependencies is undefined", () => {
			const pkg: BaseManifest = { dependencies: { react: "^18.0.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result.optionalDependencies).toBeUndefined();
		});

		it("should handle an empty package with no dependency fields", () => {
			const pkg = {};
			const result = pinAllDependencies(pkg, context);
			expect(result).toEqual({});
		});

		it("should trim whitespace and remove prefix", () => {
			const pkg = { dependencies: { react: "  ^18.0.0  " } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.react).toBe("18.0.0");
		});

		it("should trim whitespace from a pinned version with no prefix", () => {
			const pkg = { dependencies: { react: "  18.0.0  " } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.react).toBe("18.0.0");
		});

		it("should mutate and return the same pkg reference", () => {
			const pkg = { dependencies: { react: "^18.0.0" } };
			const result = pinAllDependencies(pkg, context);
			expect(result).toBe(pkg);
		});

		it("should process all three dependency types in one call", () => {
			const pkg = {
				dependencies: { react: "^18.0.0" },
				devDependencies: { vitest: "~4.0.18" },
				optionalDependencies: { fsevents: "^2.3.3" },
			};
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.react).toBe("18.0.0");
			expect(result.devDependencies?.vitest).toBe("4.0.18");
			expect(result.optionalDependencies?.fsevents).toBe("2.3.3");
		});

		it("should pin multiple packages within the same dependency type", () => {
			const pkg = {
				dependencies: {
					"react": "^18.0.0",
					"react-dom": "~18.0.0",
					"typescript": "5.4.5",
				},
			};
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.react).toBe("18.0.0");
			expect(result.dependencies?.["react-dom"]).toBe("18.0.0");
			expect(result.dependencies?.typescript).toBe("5.4.5");
		});
	});
});
