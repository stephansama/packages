import { describe, expect, it } from "vitest";
import * as z from "zod";

import { createHandlebarSchemaMap } from "@/map";
import { getFileContext } from "@/utils";

const { templateDirectory } = getFileContext(import.meta.url);

const validSchema = createHandlebarSchemaMap(
	{
		constList: {
			path: "./fixtures/map/const-list.ts.hbs",
			schema: z.object({
				body: z.unknown(),
				name: z.string(),
				plural_name: z.string(),
			}),
		},
		constMap: {
			path: "./fixtures/map/const-map.ts.hbs",
			schema: z.object({
				items: z.array(
					z.object({
						key: z.string(),
						value: z.unknown(),
					}),
				),
				map_type: z.string(),
				name: z.string(),
			}),
		},
	},
	{ templateDirectory },
);

const invalidSchema = createHandlebarSchemaMap(
	{
		constList: {
			path: "./fixtures/map/const-list.ts.hbs",
			schema: z.object({
				body: z.unknown(),
				name: z.string(),
				plural_name: z.string(),
			}),
		},
		constMap: {
			path: "./fixtures/map/const-map.ts.hbs",
			schema: z.object({
				items: z.array(
					z.object({
						key: z.string(),
						value: z.unknown(),
					}),
				),
				map_type: z.string(),
				name: z.string(),
			}),
		},
		invalid: {
			path: "./fixtures/map/invalid.hbs",
			schema: z.object({}),
		},
	},
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
		const output = await validSchema.compile("constList", {
			body: "body",
			name: "name",
			plural_name: "Plural",
		});

		expect(output);
	});
});
