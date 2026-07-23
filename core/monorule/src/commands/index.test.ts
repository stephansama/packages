import { describe, expect, it } from "vitest";

import { act as generateAct } from "./generate";
import { actions, commands } from "./index";
import { act as listAct } from "./list";

describe("commands", () => {
	it("should register the generate and list command metas", () => {
		expect(commands).toHaveLength(2);
		expect(commands.map((command) => command.options.name)).toEqual([
			"generate",
			"list",
		]);
	});

	it("should map command names to their actions", () => {
		expect(actions.generate).toBe(generateAct);
		expect(actions.list).toBe(listAct);
	});
});
