import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
});

it("does log error when verbosity is 0", async () => {
	const module = await import("./log");
	const errorSpy = vi.spyOn(console, "error");
	module.ERROR("message");
	expect(errorSpy).toHaveBeenCalled();
});

it("does not log info when verbosity is 0", async () => {
	const module = await import("./log");
	const infoSpy = vi.spyOn(console, "info");
	module.INFO("message");
	expect(infoSpy).not.toHaveBeenCalled();
});

it("does not log warning when verbosity is 0", async () => {
	const module = await import("./log");
	const warnSpy = vi.spyOn(console, "warn");
	module.WARN("message");
	expect(warnSpy).not.toHaveBeenCalled();
});
