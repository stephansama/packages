import { describe, expect, it } from "vitest";
import * as z from "zod";

import * as normalize from "@/normalize";

import { arkUser } from "./fixtures/schemas/arktype";
import { handlebarsUser } from "./fixtures/schemas/handlebars";
import { valibotUser } from "./fixtures/schemas/valibot";
import { zodUser } from "./fixtures/schemas/zod";

describe("schema normalization (real libraries)", () => {
	it("normalizes arktype schema", () => {
		const normalized = normalize.standardSchema(arkUser as any);

		expect(normalized).toMatchInlineSnapshot(
			{},
			`
			{
			  "kind": "any",
			  "optional": false,
			}
		`,
		);
	});

	it("normalizes valibot schema", () => {
		const normalized = normalize.standardSchema(valibotUser as any);

		expect(normalized).toEqual({
			kind: "object",
			optional: false,
			shape: {
				age: { kind: "number", optional: true },
				name: { kind: "string", optional: false },
				tags: {
					element: { kind: "string", optional: false },
					kind: "array",
					optional: false,
				},
			},
		});
	});

	it("normalizes zod schema", () => {
		const normalized = normalize.standardSchema(zodUser as any);

		expect(normalized).toEqual({
			kind: "object",
			optional: false,
			shape: {
				age: { kind: "number", optional: true },
				name: { kind: "string", optional: false },
				tags: {
					element: { kind: "string", optional: false },
					kind: "array",
					optional: false,
				},
			},
		});
	});

	it("normalizes handlebars schema via barhandles", () => {
		const normalized = normalize.handlebarSchema(handlebarsUser);

		expect(normalized).toEqual({
			kind: "object",
			optional: false,
			shape: {
				age: { kind: "any", optional: false },
				name: { kind: "any", optional: false },
				tags: {
					element: { kind: "any", optional: false },
					kind: "array",
					optional: false,
				},
			},
		});
	});
});

describe("schema comparison", () => {
	it("arktype and zod schemas are compatible", () => {
		const ark = normalize.standardSchema(arkUser);
		const zod = normalize.standardSchema(zodUser);

		const errors = normalize.compareSchemas(ark, zod, "user");

		expect(errors).toEqual([]);
	});

	it("valibot and handlebars schemas are compatible", () => {
		const valibot = normalize.standardSchema(valibotUser);
		const handlebars = normalize.handlebarSchema(handlebarsUser);

		const errors = normalize.compareSchemas(valibot, handlebars);

		expect(errors).toEqual([]);
	});

	it("detects incompatible schemas", () => {
		const handlebars = normalize.handlebarSchema(handlebarsUser);
		const incompatibleZod = normalize.standardSchema(
			z.object({
				name: z.string(),
				tags: z.array(z.string()),
			}),
		);

		const errors = normalize.compareSchemas(
			handlebars,
			incompatibleZod,
			"user",
		);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toMatch(/Missing key/);
		expect(errors[0]).toContain("age");
	});
});
