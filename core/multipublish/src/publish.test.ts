import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { publishPlatform } from "./publish";

const mocks = vi.hoisted(() => ({
	detectPackageManager: vi.fn(),
	execFileSync: vi.fn(),
	execSync: vi.fn(),
	existsSync: vi.fn(),
	findRoot: vi.fn(),
	getArgs: vi.fn(),
	loadConfig: vi.fn(),
	readFile: vi.fn(),
	writeFile: vi.fn(),
}));

vi.mock("@manypkg/find-root", () => ({
	findRoot: mocks.findRoot,
}));

vi.mock("node:fs", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs")>();
	return {
		...mod,
		existsSync: mocks.existsSync,
	};
});

vi.mock("node:child_process", () => ({
	execFileSync: mocks.execFileSync,
	execSync: mocks.execSync,
}));

vi.mock("node:fs/promises", async (importOriginal) => {
	const mod = await importOriginal<typeof import("node:fs/promises")>();
	return {
		...mod,
		readFile: mocks.readFile,
		writeFile: mocks.writeFile,
	};
});

vi.mock("./args", () => ({ getArgs: mocks.getArgs }));

vi.mock("./detect", () => ({
	detectPackageManager: mocks.detectPackageManager,
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
		loadConfig: mocks.loadConfig,
		updateIncludeExcludeList: vi.fn(),
	};
});

describe("publish", () => {
	beforeEach(() => {
		mocks.getArgs.mockResolvedValue({ dry: false });
		mocks.detectPackageManager.mockResolvedValue("pnpm");
		mocks.findRoot.mockResolvedValue({ rootDir: "/fake/root" });
	});

	afterEach(() => {
		vi.resetAllMocks();
		vi.unstubAllEnvs();
	});

	describe("publishPlatform", () => {
		it("should publish to npm with package.json strategy", async () => {
			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					name: "test-pkg",
					version: "1.0.0",
				},
				relativeDir: "./pkg",
			};

			await publishPlatform(pkg, [
				"npm",
				{
					registry: "https://registry.npmjs.org/",
					strategy: "package.json",
				},
			]);

			expect(mocks.writeFile).toHaveBeenCalledWith(
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

			expect(mocks.execSync).toHaveBeenCalledWith(
				"pnpm publish --no-git-checks",
				{ stdio: "inherit" },
			);
		});

		it("should publish to npm with .npmrc strategy", async () => {
			mocks.existsSync.mockReturnValue(false);
			vi.stubEnv("NPM_TOKEN", "test-token");

			const pkg = {
				dir: "/path/to/pkg",
				packageJson: {
					name: "@scope/test-pkg",
					version: "1.0.0",
				},
				relativeDir: "./pkg",
			} as const;

			await publishPlatform(pkg, [
				"npm",
				{
					registry: "https://registry.npmjs.org/",
					strategy: ".npmrc",
					tokenEnvironmentKey: "NPM_TOKEN",
				},
			]);

			expect(mocks.writeFile).toHaveBeenCalledWith(
				"/fake/root/.npmrc",
				expect.stringContaining("test-token"),
			);

			expect(mocks.execSync).toHaveBeenCalledWith(
				"pnpm publish --no-git-checks",
				{ stdio: "inherit" },
			);
		});

		it("should publish to jsr without token", async () => {
			vi.stubEnv("JSR_AUTH_TOKEN", "");
			vi.mocked(mocks.loadConfig).mockResolvedValue({
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
				relativeDir: "./pkg",
			};

			const platform = "jsr";

			await publishPlatform(pkg, platform);

			expect(mocks.writeFile).toHaveBeenCalledWith(
				"/path/to/pkg/jsr.json",
				expect.any(String),
			);

			expect(mocks.execSync).toHaveBeenCalledWith(
				"pnpm dlx jsr publish --allow-dirty --allow-slow-types",
				{ stdio: "inherit" },
			);
		});

		it("should publish to jsr with token", async () => {
			const token = "test-token";
			vi.stubEnv("JSR_AUTH_TOKEN", token);

			vi.mocked(mocks.loadConfig).mockResolvedValue({
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
				relativeDir: "./pkg",
			};

			const platform = "jsr";

			await publishPlatform(pkg, platform);

			expect(mocks.writeFile).toHaveBeenCalledWith(
				"/path/to/pkg/jsr.json",
				expect.any(String),
			);

			expect(mocks.execSync).toHaveBeenCalledWith(
				`pnpm dlx jsr publish --allow-dirty --allow-slow-types --token ${token}`,
				{ stdio: "inherit" },
			);
		});
	});
});
