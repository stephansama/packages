import { describe, expect, it } from "vitest";

import { debug, info, moduleName, warn } from "../src/util";

describe("util", () => {
	it("should have correct module name", () => {
		expect(moduleName).toBe("aicommitmsg");
	});

	it("should export debuggers", () => {
		expect(debug).toBeDefined();
		expect(info).toBeDefined();
		expect(warn).toBeDefined();
		expect(typeof debug).toBe("function");
	});
});
