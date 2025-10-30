import { afterEach, expect, it, vi } from "vitest";

import { warnOnce } from "./utils";

afterEach(() => {
	vi.restoreAllMocks();
});

it("logs a message only once", () => {
	const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
	warnOnce(false, "This message should be logged only once");
	warnOnce(false, "This message should be logged only once");
	expect(consoleSpy).toHaveBeenCalledTimes(1);
});
