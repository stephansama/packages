import { describe, expect, it } from "vitest";

import type { Kind } from "./finding";

import { classifySpec } from "./classify";

describe("classifySpec", () => {
	const cases: Record<Kind, string[]> = {
		"caret": ["^1.2.3", "^0.0.1", "^1.2.3-beta.1", "^ 1.2.3"],
		"comparison": [
			">=1.2.3",
			">1.2.3",
			"<2.0.0",
			"<=2.0.0",
			">= 1.2.3",
			">=1",
		],
		"hyphen": ["1.2.3 - 2.0.0", "1 - 2"],
		"intersection": [">=1.2.3 <2.0.0", ">= 1.2.3 < 2.0.0"],
		"partial": ["^1.2", "~1.2", "1", "1.2", "=1.2"],
		"tag": ["latest", "next", "beta"],
		"tilde": ["~1.2.3", "~>1.2.3"],
		"union": ["^1.0.0 || ^2.0.0", "1.2.3 - 2.0.0 || 3.x"],
		"wildcard": ["*", "x", "X", "", "  ", "x.x.x", "*.*"],
		"x-range": ["1.x", "1.2.x", "1.*", "1.2.X", "^1.x", "~1.2.x"],
	};

	for (const [kind, specs] of Object.entries(cases)) {
		it.each(specs)(`classifies %j as ${kind}`, (spec) => {
			expect(classifySpec(spec)).toBe(kind);
		});
	}

	it.each([
		"1.2.3",
		"v1.2.3",
		"=1.2.3",
		" 1.2.3 ",
		"1.2.3-beta.1",
		"1.2.3+build.5",
		"workspace:*",
		"workspace:^",
		"catalog:",
		"catalog:cli",
		"file:../foo",
		"link:../foo",
		"portal:../foo",
		"patch:foo@1.0.0#./patch",
		"git+https://github.com/user/repo.git",
		"git://github.com/user/repo.git#v1.0.0",
		"github:user/repo",
		"user/repo",
		"user/repo#semver:^1.0.0",
		"https://example.com/foo-1.0.0.tgz",
		"./local-package",
		"../local-package",
		"/abs/path",
		"~/path",
		"npm:foo@1.2.3",
		"npm:@scope/foo@1.2.3",
	])("never treats %j as floating", (spec) => {
		expect(classifySpec(spec)).toBeUndefined();
	});

	it("classifies npm aliases by their range", () => {
		expect(classifySpec("npm:foo@^1.2.3")).toBe("caret");
		expect(classifySpec("npm:@scope/foo@*")).toBe("wildcard");
		expect(classifySpec("npm:@scope/foo@latest")).toBe("tag");
	});

	it("classifies long runs of operators in linear time", () => {
		const start = performance.now();
		expect(classifySpec("<".repeat(50_000) + "1")).toBe("comparison");
		expect(performance.now() - start).toBeLessThan(100);
	});
});
