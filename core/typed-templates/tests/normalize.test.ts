import barhandles from "barhandles";
import { expect, it } from "vitest";
import * as z from "zod";

import * as normalize from "@/normalize";

it("doesn't find issues when there aren't any", () => {
	const handlebarsTemplate = ` {{name}} `;

	const ast = barhandles.extractSchema(handlebarsTemplate);

	const schema = z.object({ name: z.string() });

	const normalizedHandlebarsSchema = normalize.handlebarSchema(ast);

	const normalizedStandardSchema = normalize.standardSchema(schema);
	const errors = normalize.compareSchemas(
		normalizedHandlebarsSchema,
		normalizedStandardSchema,
	);

	expect(errors.length).toBe(0);
});

it("finds errors when missing properties from handlebars schema", () => {
	const handlebarsTemplate = ` {{name}} `;

	const ast = barhandles.extractSchema(handlebarsTemplate);

	const schema = z.object({ different: z.string() });

	const normalizedHandlebarsSchema = normalize.handlebarSchema(ast);

	const normalizedStandardSchema = normalize.standardSchema(schema);
	const errors = normalize.compareSchemas(
		normalizedHandlebarsSchema,
		normalizedStandardSchema,
	);

	expect(errors.length).toBe(1);
});
