import { afterEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	//
}));

afterEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
});

it("does log error when verbosity is 0", async () => {
	const module = await import("./log.ts");
	const errorSpy = vi.spyOn(console, "error");
	module.ERROR("message");
	expect(errorSpy).toHaveBeenCalled();
});

it("does not log info when verbosity is 0", async () => {
	const module = await import("./log.ts");
	const infoSpy = vi.spyOn(console, "info");
	module.INFO("message");
	expect(infoSpy).not.toHaveBeenCalled();
});

it("logs info when verbosity is 1", async () => {
	const module = await import("./log.ts");
	module.setVerbosity(1);
	const infoSpy = vi.spyOn(console, "info");
	module.INFO("message", "extra");
	expect(infoSpy).toHaveBeenCalled();
});

it("does not log warning when verbosity is 0", async () => {
	const module = await import("./log.ts");
	const warnSpy = vi.spyOn(console, "warn");
	module.WARN("message");
	expect(warnSpy).not.toHaveBeenCalled();
});

it("logs warning when verbosity is 1", async () => {
	const module = await import("./log.ts");
	module.setVerbosity(1);
	const warnSpy = vi.spyOn(console, "warn");
	module.WARN("message", "extra");
	expect(warnSpy).toHaveBeenCalled();
});
