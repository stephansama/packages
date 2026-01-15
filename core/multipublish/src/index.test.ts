import { afterEach, describe, expect, it, vi } from "vitest";

import { run } from "./index";

const mocks = vi.hoisted(() => ({
	findRoot: vi.fn(() => Promise.resolve({ rootDir: "/mock/root" })),
	getArgs: vi.fn(() => Promise.resolve({ versionJsr: false })),
	getPackages: vi.fn(() =>
		Promise.resolve({
			packages: [
				{
					dir: "/mock/root/pkg1",
					packageJson: { name: "pkg1", version: "1.0.0" },
					relativeDir: "pkg1",
				},
			],
		}),
	),
	loadConfig: vi.fn(() => Promise.resolve({ platforms: ["npm"] })),
	loadReleases: vi.fn(() =>
		Promise.resolve([{ name: "pkg1", version: "1.0.0" }]),
	),
	publishPlatform: vi.fn(),
	updateJsrConfigVersion: vi.fn(),
}));

vi.mock("@manypkg/find-root", () => ({ findRoot: mocks.findRoot }));
vi.mock("@manypkg/get-packages", () => ({ getPackages: mocks.getPackages }));

vi.mock("./args", () => ({ getArgs: mocks.getArgs }));
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
		expect(mocks.getArgs).toHaveBeenCalledOnce();
		expect(mocks.loadConfig).toHaveBeenCalledOnce();
		expect(mocks.getPackages).toHaveBeenCalledOnce();
		expect(mocks.loadReleases).toHaveBeenCalledOnce();
		expect(mocks.updateJsrConfigVersion).not.toHaveBeenCalled();
		expect(mocks.publishPlatform).toHaveBeenCalledOnce();
		expect(mocks.publishPlatform).toHaveBeenCalledWith(
			expect.objectContaining({
				packageJson: expect.objectContaining({
					name: "pkg1",
					version: "1.0.0",
				}),
			}),
			"npm",
		);
	});

	it("should call updateJsrConfigVersion if args.versionJsr is true", async () => {
		mocks.getArgs.mockResolvedValueOnce({ versionJsr: true });

		await run();

		expect(mocks.updateJsrConfigVersion).toHaveBeenCalledOnce();
		expect(mocks.publishPlatform).not.toHaveBeenCalled();
	});
});
