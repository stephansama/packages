import * as findRoot from "@manypkg/find-root";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getArgs } from "./args";
import { detectPackageManager } from "./detect";
import * as jsr from "./jsr";
import { publishPlatform } from "./publish";

vi.mock("@manypkg/find-root", () => ({
	findRoot: vi.fn(),
}));

vi.mock("node:fs", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs")>();
	return {
		...mod,
		existsSync: vi.fn(),
	};
});

vi.mock("node:child_process", () => ({
	execFileSync: vi.fn(),
	execSync: vi.fn(),
}));

vi.mock("node:fs/promises", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs/promises")>();
	return {
		...mod,
		readFile: vi.fn(),
		writeFile: vi.fn(),
	};
});

vi.mock("./args", () => ({
	getArgs: vi.fn(),
}));

vi.mock("./detect", () => ({
	detectPackageManager: vi.fn(),
}));

vi.mock("./util", async (importOriginal) => {
	const mod = await importOriginal<typeof import("./util")>();
	return {
		...mod,
		chdir: vi.fn(async (_dir, cb) => {
			await cb();
		}),
		gitClean: vi.fn(),
	};
});

vi.mock("./jsr", async (importOriginal) => {
	const mod = await importOriginal<typeof import("./jsr")>();
	return {
		...mod,
		loadConfig: vi.fn(),
		updateIncludeExcludeList: vi.fn(),
	};
});

describe("publish", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(getArgs).mockResolvedValue({ dry: false });
		vi.mocked(detectPackageManager).mockResolvedValue("pnpm");
		vi.mocked(findRoot.findRoot).mockResolvedValue({
			rootDir: "/fake/root",
		} as any);
	});

	describe("publishPlatform", () => {
		it("should publish to npm with package.json strategy", async () => {
			const fsp = await import("node:fs/promises");
			const cp = await import("node:child_process");

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					name: "test-pkg",
					version: "1.0.0",
				},
			} as any;

			await publishPlatform(pkg, [
				"npm",
				{
					registry: "https://registry.npmjs.org/",
					strategy: "package.json",
				},
			]);

			expect(fsp.writeFile).toHaveBeenCalledWith(
				"/path/to/pkg/package.json",
				JSON.stringify(
					{
						...pkg.packageJson,
						publishConfig: {
							registry: "https://registry.npmjs.org/",
						},
					},
					undefined,
					2,
				),
			);

			expect(cp.execSync).toHaveBeenCalledWith(
				"pnpm publish --no-git-checks",
				{ stdio: "inherit" },
			);
		});

		it("should publish to npm with .npmrc strategy", async () => {
			const fsp = await import("node:fs/promises");
			const cp = await import("node:child_process");
			const fs = await import("node:fs");

			vi.spyOn(fs, "existsSync").mockReturnValue(false);
			process.env.NPM_TOKEN = "test-token";

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					name: "@scope/test-pkg",
					version: "1.0.0",
				},
			} as any;

			await publishPlatform(pkg, [
				"npm",
				{
					registry: "https://registry.npmjs.org/",
					strategy: ".npmrc",
					tokenEnvironmentKey: "NPM_TOKEN",
				},
			]);

			expect(fsp.writeFile).toHaveBeenCalledWith(
				"/fake/root/.npmrc",
				expect.stringContaining("test-token"),
			);

			expect(cp.execSync).toHaveBeenCalledWith(
				"pnpm publish --no-git-checks",
				{ stdio: "inherit" },
			);

			delete process.env.NPM_TOKEN;
		});

		it("should publish to jsr", async () => {
			const fsp = await import("node:fs/promises");
			const cp = await import("node:child_process");

			vi.mocked(jsr.loadConfig).mockResolvedValue({
				config: {
					exports: "index.ts",
					name: "@scope/pkg",
					version: "1.0.0",
				},
				filename: "/path/to/pkg/jsr.json",
			});

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					name: "@scope/pkg",
					version: "1.0.0",
				},
			} as any;
			const platform = "jsr";

			await publishPlatform(pkg, platform);

			expect(fsp.writeFile).toHaveBeenCalledWith(
				"/path/to/pkg/jsr.json",
				expect.any(String),
			);

			expect(cp.execSync).toHaveBeenCalledWith(
				"pnpm dlx jsr publish --allow-dirty --allow-slow-types",
				{ stdio: "inherit" },
			);
		});
	});
});
