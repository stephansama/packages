import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ run: vi.fn() }));

vi.mock("./index", async (importOriginal) => ({
	...(await importOriginal<typeof import("./index")>()),
	run: mocks.run,
}));

describe("cli", () => {
	beforeEach(() => {
		vi.resetModules();
		process.exitCode = undefined;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		process.exitCode = undefined;
	});

	it("should exit 0 when every publish succeeds", async () => {
		mocks.run.mockImplementation(() => Promise.resolve());

		await import("./cli");

		expect(mocks.run).toHaveBeenCalledOnce();
		expect(process.exitCode).toBeUndefined();
	});

	it("should print the summary and exit 1 when a publish fails", async () => {
		const { PublishError } = await import("./index");
		mocks.run.mockRejectedValue(new PublishError(["pkg (jsr)"]));
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		await import("./cli");

		expect(consoleError).toHaveBeenCalledWith(
			"1 publish failed: pkg (jsr)",
		);
		expect(process.exitCode).toBe(1);
	});

	it("should rethrow errors that aren't publish failures", async () => {
		mocks.run.mockRejectedValue(new Error("bad config"));

		await expect(import("./cli")).rejects.toThrow("bad config");
	});
});
