import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ enable: vi.fn() }));

vi.mock("obug", async (importOriginal) => ({
	...(await importOriginal<typeof import("obug")>()),
	enable: mocks.enable,
}));

import {
	DEBUG_BASE_NAMESPACE,
	DEBUG_NAMESPACES,
	enable,
	VERBOSE_SCOPE,
} from "./log";

describe("log", () => {
	afterEach(vi.clearAllMocks);

	it("should expose the expected namespace constants", () => {
		expect(DEBUG_BASE_NAMESPACE).toBe("monorule");
		expect(DEBUG_NAMESPACES).toEqual(["error", "info", "warn"]);
		expect(VERBOSE_SCOPE).toBe("info");
	});

	it("should enable only error at verbosity 0", () => {
		enable(0);
		expect(mocks.enable).toHaveBeenCalledWith("monorule:error");
	});

	it("should enable error and info at verbosity 1", () => {
		enable(1);
		expect(mocks.enable).toHaveBeenCalledWith(
			"monorule:error,monorule:info",
		);
	});

	it("should enable all scopes at verbosity 2", () => {
		enable(2);
		expect(mocks.enable).toHaveBeenCalledWith(
			"monorule:error,monorule:info,monorule:warn",
		);
	});

	it("should default to error only when verbosity is undefined", () => {
		// eslint-disable-next-line unicorn/no-useless-undefined -- verbosity is a required parameter
		enable(undefined);
		expect(mocks.enable).toHaveBeenCalledWith("monorule:error");
	});
});
