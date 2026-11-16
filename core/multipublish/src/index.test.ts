import { afterEach, describe, expect, it, vi } from "vitest";

import { PublishError, run } from "./index";

const mocks = vi.hoisted(() => ({
	findRoot: vi.fn(() => Promise.resolve({ rootDir: "/mock/root" })),
	getArguments: vi.fn(() => Promise.resolve({ versionJsr: false })),
	getPackages: vi.fn(() =>
		Promise.resolve({
			packages: [
				{
					dir: "/mock/root/pkg1",
					packageJson: { name: "pkg1", version: "1.0.0" },
					relativeDir: "pkg1",
				},
				{
					dir: "/mock/root/pkg2",
					packageJson: {
						name: "@stephansama/pkg2",
						version: "1.0.0",
					},
					relativeDir: "pkg2",
				},
			],
		}),
	),
	loadConfig: vi.fn(() => Promise.resolve({ platforms: ["npm"] })),
	loadReleases: vi.fn(() =>
		Promise.resolve([
			{ name: "pkg1", version: "1.0.0" },
			{ name: "@stephansama/pkg2", version: "1.0.0" },
		]),
	),
	publishPlatform: vi.fn(),
	updateJsrConfigVersion: vi.fn(),
}));

vi.mock("@manypkg/find-root", () => ({ findRoot: mocks.findRoot }));
vi.mock("@manypkg/get-packages", () => ({ getPackages: mocks.getPackages }));

vi.mock("./arguments", () => ({ getArguments: mocks.getArguments }));
vi.mock("./config", () => ({ loadConfig: mocks.loadConfig }));
vi.mock("./release", () => ({ loadReleases: mocks.loadReleases }));
vi.mock("./publish", () => ({ publishPlatform: mocks.publishPlatform }));
vi.mock("./jsr", () => ({
	updateJsrConfigVersion: mocks.updateJsrConfigVersion,
}));

describe("run", () => {
	afterEach(vi.clearAllMocks);

	it("should call necessary functions and publish platforms", async () => {
		await run();

		expect(mocks.findRoot).toHaveBeenCalledOnce();
		expect(mocks.getArguments).toHaveBeenCalledOnce();
		expect(mocks.loadConfig).toHaveBeenCalledOnce();
		expect(mocks.getPackages).toHaveBeenCalledOnce();
		expect(mocks.loadReleases).toHaveBeenCalledOnce();
		expect(mocks.updateJsrConfigVersion).not.toHaveBeenCalled();
		expect(mocks.publishPlatform).toHaveBeenCalledWith(
			expect.objectContaining({
				packageJson: {
					name: "pkg1",
					version: "1.0.0",
				},
			}),
			"npm",
		);
		expect(mocks.publishPlatform).toHaveBeenCalledWith(
			expect.objectContaining({
				packageJson: {
					name: "@stephansama/pkg2",
					version: "1.0.0",
				},
			}),
			"npm",
		);
	});

	it("should call updateJsrConfigVersion if args.versionJsr is true", async () => {
		mocks.getArguments.mockResolvedValueOnce({ versionJsr: true });

		await run();

		expect(mocks.updateJsrConfigVersion).toHaveBeenCalledOnce();
		expect(mocks.publishPlatform).not.toHaveBeenCalled();
	});

	it("should publish the remaining packages after a failure, then throw", async () => {
		mocks.publishPlatform.mockRejectedValueOnce(
			new Error("npm publish failed for pkg1"),
		);
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const error = await run().catch((error_: unknown) => error_);

		expect(mocks.publishPlatform).toHaveBeenCalledTimes(2);
		expect(error).toBeInstanceOf(PublishError);
		expect((error as PublishError).failures).toEqual(["pkg1 (npm)"]);
		expect((error as PublishError).message).toBe(
			"1 publish failed: pkg1 (npm)",
		);
		expect(consoleError).toHaveBeenCalledWith(
			"✖ pkg1 (npm): npm publish failed for pkg1",
		);
		consoleError.mockRestore();
	});
});
