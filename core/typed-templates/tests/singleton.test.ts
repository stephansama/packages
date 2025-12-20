import { describe, expect, it } from "vitest";
import * as z from "zod";

import { createHandlebarSchemaSingleton } from "@/singleton";
import { getFileContext } from "@/utils";

const { templateDirectory } = getFileContext(import.meta.url);

const validSchema = createHandlebarSchemaSingleton(
	["./fixtures/singleton/valid.hbs", "./fixtures/singleton/valid2.hbs"],
	z.object({
		items: z.array(z.object({ key: z.string(), value: z.string() })),
		map_type: z.string(),
		name: z.string(),
	}),
	{ templateDirectory },
);

const invalidSchema = createHandlebarSchemaSingleton(
	["./fixtures/singleton/invalid.hbs", "./fixtures/singleton/valid.hbs"],
	z.object({
		items: z.array(z.object({ key: z.string(), value: z.string() })),
		map_type: z.string(),
		name: z.string(),
	}),
	{ templateDirectory },
);

describe("audit", () => {
	it("it validates valid files", async () => {
		const result = await validSchema.audit();
		expect(result).toBeTruthy();
	});

	it("it invalidates an invalid files", async () => {
		expect(invalidSchema.audit()).rejects.toThrow(
			"Missing key 'different'",
		);
	});
});

describe("compile", () => {
	it("prevents compiling bad input", async () => {
		// @ts-expect-error
		expect(validSchema.compile("constList", {})).rejects.toThrow();
	});

	it("prevents compiling bad input", async () => {
		const output = await validSchema.compile(
			"./fixtures/singleton/valid.hbs",
			{
				items: [{ key: "key", value: "value" }],
				map_type: "Map",
				name: "name",
			},
		);

		expect(output);
	});
});
