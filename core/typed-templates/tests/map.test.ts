import { describe, expect, it } from "vitest";
import * as z from "zod";

import { createHandlebarSchemaMap } from "@/map";
import { getFileContext } from "@/utilities";

const { templateDirectory } = getFileContext(import.meta.url);

const validSchema = createHandlebarSchemaMap(
	{
		constList: {
			path: "./fixtures/map/const-list.ts.hbs",
			schema: z.object({
				body: z.unknown(),
				name: z.string().trim(),
				plural_name: z.string().trim(),
			}),
		},
		constMap: {
			path: "./fixtures/map/const-map.ts.hbs",
			schema: z.object({
				items: z.array(
					z.object({
						key: z.string().trim(),
						value: z.unknown(),
					}),
				),
				map_type: z.string().trim(),
				name: z.string().trim(),
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
				name: z.string().trim(),
				plural_name: z.string().trim(),
			}),
		},
		constMap: {
			path: "./fixtures/map/const-map.ts.hbs",
			schema: z.object({
				items: z.array(
					z.object({
						key: z.string().trim(),
						value: z.unknown(),
					}),
				),
				map_type: z.string().trim(),
				name: z.string().trim(),
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
	it("validates valid files", async () => {
		const result = await validSchema.audit();
		expect(result).toBeTruthy();
	});

	it("invalidates an invalid files", async () => {
		await expect(invalidSchema.audit()).rejects.toThrow(
			"Missing key 'different'",
		);
	});
});

describe("compile", () => {
	it("prevents compiling bad input", async () => {
		// @ts-expect-error something with typescript
		await expect(validSchema.compile("constList", {})).rejects.toThrow();
	});

	it("compiles with valid input", async () => {
		const output = await validSchema.compile("constList", {
			body: "body",
			name: "name",
			plural_name: "Plural",
		});

		expect(output).toBeTruthy();
	});
});
