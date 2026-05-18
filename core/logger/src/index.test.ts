import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createLogger } from "./index";

describe("createLogger", () => {
	// Clone, don't capture-by-ref — deletes/sets here would otherwise leak
	// into the baseline restored in afterEach (same fix pattern as STE-33).
	const originalEnvironment = { ...process.env };

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		process.env = { ...originalEnvironment };
		vi.restoreAllMocks();
	});

	it("emits info messages by default", () => {
		delete process.env.LOG_LEVEL;
		delete process.env.LOG_FORMAT;
		const spy = vi.spyOn(console, "log").mockImplementation(() => {
			// silenced for the assertion
		});
		const log = createLogger("test");
		log.info("hello %s", "world");
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls[0]?.[0]).toBe("[test]");
		expect(spy.mock.calls[0]?.[1]).toBe("hello %s");
		expect(spy.mock.calls[0]?.[2]).toBe("world");
	});

	it("suppresses debug below threshold", () => {
		delete process.env.LOG_LEVEL;
		const spy = vi.spyOn(console, "log").mockImplementation(() => {
			// silenced
		});
		const log = createLogger("test");
		log.debug("hidden");
		expect(spy).not.toHaveBeenCalled();
	});

	it("enables debug when LOG_LEVEL=debug", () => {
		process.env.LOG_LEVEL = "debug";
		const spy = vi.spyOn(console, "log").mockImplementation(() => {
			// silenced
		});
		const log = createLogger("test");
		log.debug("visible");
		expect(spy).toHaveBeenCalled();
	});

	it("routes errors to console.error", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {
			// silenced
		});
		const log = createLogger("test");
		log.error("boom");
		expect(spy).toHaveBeenCalled();
	});

	it("emits JSON lines when LOG_FORMAT=json", () => {
		process.env.LOG_FORMAT = "json";
		const spy = vi.spyOn(console, "log").mockImplementation(() => {
			// silenced
		});
		const log = createLogger("test");
		log.info("hello");
		const payload = JSON.parse(spy.mock.calls[0]?.[0] as string) as Record<
			string,
			unknown
		>;
		expect(payload.namespace).toBe("test");
		expect(payload.level).toBe("info");
		expect(payload.message).toBe("hello");
		expect(typeof payload.timestamp).toBe("string");
	});
});
