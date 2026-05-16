import * as icons from "simple-icons";
import { afterEach, expect, it, vi } from "vitest";

import * as logger from "./log";
import * as module from "./icon";

afterEach(vi.clearAllMocks);

it.each([
	["handlebars", "handlebarsdotjs"],
	["@commitlint/cli", "commitlint"],
	["vue", "vuedotjs"],
	["c#", "sharp"],
	["f#", "fsharp"],
	["c++", "cplusplus"],
	["react-router", "reactrouter"],
	["REACT", "react"],
] as [string, string][])(
	"createSlugName(%s) returns %s",
	(input, expected) => {
		expect(module.createSlugName(input)).toBe(expected);
	},
);

it("returns colorMapOverride color for @tanstack/ai", () => {
	const [color, slug] = module.getSimpleIconColor("@tanstack/ai");
	expect(color).toBe("f6339a");
	expect(slug).toBe("@tanstack/ai");
});

it("returns colorMapOverride color for handlebars", () => {
	const [color, slug] = module.getSimpleIconColor("handlebars");
	expect(color).toBe("d46926");
	expect(slug).toBe("handlebarsdotjs");
});

it("returns hex from simple-icons for react", () => {
	const [color, slug] = module.getSimpleIconColor("react");
	expect(color).toBe(icons.siReact.hex);
	expect(slug).toBe("react");
});

it("returns undefined color for unknown package", () => {
	const [color, slug] = module.getSimpleIconColor("nonexistent-xyz-package");
	expect(color).toBeUndefined();
	expect(slug).toBe("nonexistentxyzpackage");
});

it("calls INFO logger when getting icon color", () => {
	const infoSpy = vi.spyOn(logger, "INFO");
	module.getSimpleIconColor("react");
	expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining("react"));
});
