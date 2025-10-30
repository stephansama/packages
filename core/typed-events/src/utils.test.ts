import { afterEach, expect, it, vi } from "vitest";

import { logOnce, messages } from "./utils";

afterEach(() => {
	messages.clear();
	vi.restoreAllMocks();
});

it("logs a message only once", () => {
	const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
	expect(messages.size).toBe(0);
	logOnce("This message should be logged only once");
	logOnce("This message should be logged only once");
	expect(messages.size).toBe(1);
	expect(consoleSpy).toHaveBeenCalledTimes(1);
});
