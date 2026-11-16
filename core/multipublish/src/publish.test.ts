import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { publishPlatform } from "./publish";
import * as utilities from "./utilities";

const jsrPackage = {
	dir: "/path/to/pkg",
	packageJson: { name: "@scope/pkg", version: "1.0.0" },
	relativeDir: "./pkg",
};

const mocks = vi.hoisted(() => ({
	detectPackageManager: vi.fn(),
	execFileSync: vi.fn(),
	execSync: vi.fn(),
	existsSync: vi.fn(),
	findRoot: vi.fn(),
	getArguments: vi.fn(),
	loadConfig: vi.fn(),
	readFile: vi.fn(),
	writeFile: vi.fn(),
}));

vi.mock("@manypkg/find-root", () => ({
	findRoot: mocks.findRoot,
}));

vi.mock("node:fs", async (importOriginal) => {
	const original = await importOriginal<typeof import("node:fs")>();
	return {
		...original,
		existsSync: mocks.existsSync,
	};
});

vi.mock("node:child_process", () => ({
	execFileSync: mocks.execFileSync,
	execSync: mocks.execSync,
}));

vi.mock("node:fs/promises", async (importOriginal) => {
	const module_ = await importOriginal<typeof import("node:fs/promises")>();
	return {
		...module_,
		readFile: mocks.readFile,
		writeFile: mocks.writeFile,
	};
});

vi.mock("./arguments", () => ({ getArguments: mocks.getArguments }));

vi.mock("./detect", () => ({
	detectPackageManager: mocks.detectPackageManager,
}));

vi.mock("./utilities", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("./utilities")>()),
		chdir: vi.fn(
			async (_directory: string, callback: () => Promise<void>) => {
				await callback();
			},
		),
		gitClean: vi.fn(),
	};
});

vi.mock("./jsr", async (importOriginal) => {
	const module_ = await importOriginal<typeof import("./jsr")>();
	return {
		...module_,
		loadConfig: mocks.loadConfig,
		updateIncludeExcludeList: vi.fn(),
	};
});

describe("publish", () => {
	beforeEach(() => {
		mocks.getArguments.mockResolvedValue({ dry: false });
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

		it("should un-exclude the directories its exports point into", async () => {
			vi.stubEnv("JSR_AUTH_TOKEN", "");
			mocks.loadConfig.mockResolvedValue({
				config: {
					exports: { ".": "./dist/index.mjs" },
					name: "@scope/pkg",
					version: "1.0.0",
				},
				filename: "/path/to/pkg/jsr.json",
			});

			await publishPlatform(jsrPackage, "jsr");

			const written = JSON.parse(
				mocks.writeFile.mock.calls[0]?.[1] as string,
			) as { publish?: { exclude?: string[] } };
			expect(written.publish?.exclude).toEqual(["!dist"]);
		});

		it("should throw without the token when jsr publish fails, and still clean up", async () => {
			const token = "secret-token";
			vi.stubEnv("JSR_AUTH_TOKEN", token);
			mocks.loadConfig.mockResolvedValue({
				config: {
					exports: "index.ts",
					name: "@scope/pkg",
					version: "1.0.0",
				},
				filename: "/path/to/pkg/jsr.json",
			});
			mocks.execSync.mockImplementation((command: string) => {
				throw Object.assign(new Error(`Command failed: ${command}`), {
					status: 1,
				});
			});

			const error = await publishPlatform(jsrPackage, "jsr").catch(
				(error_: unknown) => error_,
			);

			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				"jsr publish failed for @scope/pkg (exit code 1)",
			);
			expect((error as Error).message).not.toContain(token);
			expect(vi.mocked(utilities.gitClean)).toHaveBeenCalledWith(
				"/path/to/pkg/jsr.json",
			);
		});

		it("should leave out the exit code when the failure has none", async () => {
			vi.stubEnv("JSR_AUTH_TOKEN", "");
			mocks.loadConfig.mockResolvedValue({
				config: {
					exports: "index.ts",
					name: "@scope/pkg",
					version: "1.0.0",
				},
				filename: "/path/to/pkg/jsr.json",
			});
			mocks.execSync.mockImplementation(() => {
				throw new Error("spawn failed");
			});

			// an Error instance makes toThrow compare the whole message
			await expect(publishPlatform(jsrPackage, "jsr")).rejects.toThrow(
				new Error("jsr publish failed for @scope/pkg"),
			);
		});

		it("should throw when npm publish fails, and still clean up", async () => {
			vi.stubEnv("NODE_AUTH_TOKEN", "token");
			mocks.existsSync.mockReturnValue(false);
			mocks.execSync.mockImplementation(() => {
				throw Object.assign(new Error("Command failed"), { status: 2 });
			});

			await expect(publishPlatform(jsrPackage, "npm")).rejects.toThrow(
				"npm publish failed for @scope/pkg (exit code 2)",
			);
			expect(vi.mocked(utilities.gitClean)).toHaveBeenCalledWith(
				"/path/to/pkg/package.json",
			);
			expect(vi.mocked(utilities.gitClean)).toHaveBeenCalledWith(
				"/fake/root/.npmrc",
			);
		});

		it("should throw for an unscoped package with the .npmrc strategy", async () => {
			vi.stubEnv("NODE_AUTH_TOKEN", "token");
			mocks.existsSync.mockReturnValue(false);

			await expect(
				publishPlatform(
					{
						...jsrPackage,
						packageJson: { name: "pkg", version: "1.0.0" },
					},
					"npm",
				),
			).rejects.toThrow("pkg is not scoped");
			expect(mocks.execSync).not.toHaveBeenCalled();
		});
	});
});
