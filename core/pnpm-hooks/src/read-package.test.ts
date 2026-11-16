import type { HookContext } from "@pnpm/hooks.pnpmfile";
import type { BaseManifest } from "@pnpm/types";

import { describe, expect, it } from "vitest";

import { createPinAllDependencies, pinAllDependencies } from "./read-package";

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

		it.each([
			[">=1.2.3", "1.2.3"],
			["=1.2.3", "1.2.3"],
			["v1.2.3", "1.2.3"],
			["^v1.2.3", "1.2.3"],
			["~>1.2.3", "1.2.3"],
			["^ 1.2.3", "1.2.3"],
			[">= 1.2.3", "1.2.3"],
			["^1.2.3-beta.1", "1.2.3-beta.1"],
			["~1.2.3+build.5", "1.2.3+build.5"],
			["1.2.3 - 2.0.0", "1.2.3"],
			["  1.2.3 - 2.0.0  ", "1.2.3"],
			["npm:lodash@^4.17.21", "npm:lodash@4.17.21"],
			["npm:@scope/pkg@~1.2.3", "npm:@scope/pkg@1.2.3"],
		])("should pin %j to its lower bound %j", (range, expected) => {
			const pkg = { dependencies: { dep: range } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.dep).toBe(expected);
		});

		it.each([
			// no single exact lower bound
			">1.2.3",
			"<2.0.0",
			"<=2.0.0",
			"^1.2",
			"~1",
			"1.x",
			"1.2.x",
			"*",
			"",
			"1.2 - 2.0.0",
			"^1.2.3 || ^2.0.0",
			"1.2.3 - 2.0.0||0.5.0",
			"0.5.0||1.2.3 - 2.0.0",
			">=1.2.3 <2.0.0",
			"npm:lodash@4.x",
			// dist-tags
			"latest",
			"next",
			// protocols
			"workspace:*",
			"workspace:^",
			"workspace:~",
			"workspace:^1.2.3",
			"catalog:",
			"catalog:pnpm",
			"file:../local",
			"link:../local",
			"git+https://github.com/user/repo.git#v1.2.3",
			"github:user/repo#semver:^1.2.3",
			"https://example.com/pkg-1.2.3.tgz",
		])("should leave %j unchanged", (range) => {
			const pkg = { dependencies: { dep: range } };
			const result = pinAllDependencies(pkg, context);
			expect(result.dependencies?.dep).toBe(range);
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

	describe("createPinAllDependencies", () => {
		const pin = createPinAllDependencies({
			fallbacks: { "@types/node": "24.12.2", "@types/unist": "3.0.3" },
		});

		it.each(["*", "x", "X", "", "  *  "])(
			"should replace the wildcard %j with its fallback",
			(spec) => {
				const pkg = { dependencies: { "@types/node": spec } };
				const result = pin(pkg, context);
				expect(result.dependencies?.["@types/node"]).toBe("24.12.2");
			},
		);

		it("should use fallbacks in every dependency type", () => {
			const pkg = {
				dependencies: { "@types/node": "*" },
				devDependencies: { "@types/unist": "*" },
				optionalDependencies: { "@types/node": "x" },
			};
			const result = pin(pkg, context);
			expect(result.dependencies?.["@types/node"]).toBe("24.12.2");
			expect(result.devDependencies?.["@types/unist"]).toBe("3.0.3");
			expect(result.optionalDependencies?.["@types/node"]).toBe(
				"24.12.2",
			);
		});

		it("should pin non-wildcard ranges normally even with a fallback", () => {
			const pkg = { dependencies: { "@types/node": "^22.0.0" } };
			const result = pin(pkg, context);
			expect(result.dependencies?.["@types/node"]).toBe("22.0.0");
		});

		it.each(["latest", "1.x", "workspace:*", "npm:@types/node@*"])(
			"should not use a fallback for the non-wildcard spec %j",
			(spec) => {
				const pkg = { dependencies: { "@types/node": spec } };
				const result = pin(pkg, context);
				expect(result.dependencies?.["@types/node"]).toBe(spec);
			},
		);

		it("should leave wildcards without a fallback unchanged", () => {
			const pkg = { dependencies: { "@types/ms": "*" } };
			const result = pin(pkg, context);
			expect(result.dependencies?.["@types/ms"]).toBe("*");
		});

		it("should ignore inherited object keys", () => {
			const pkg = { dependencies: { constructor: "*", toString: "*" } };
			const result = pin(pkg, context);
			expect(result.dependencies).toEqual({
				constructor: "*",
				toString: "*",
			});
		});

		it("should behave like pinAllDependencies without options", () => {
			const pkg = { dependencies: { a: "*", b: "^1.2.3" } };
			const result = createPinAllDependencies()(pkg, context);
			expect(result.dependencies).toEqual({ a: "*", b: "1.2.3" });
		});
	});
});
