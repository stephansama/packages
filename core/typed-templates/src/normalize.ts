import type { StandardSchemaV1 } from "@standard-schema/spec";

export type NormalizedSchema =
	| { element: NormalizedSchema; kind: "array"; optional: boolean }
	| { kind: "any"; optional: boolean }
	| { kind: "boolean"; optional: boolean }
	| { kind: "number"; optional: boolean }
	| {
			kind: "object";
			optional: boolean;
			shape: Record<string, NormalizedSchema>;
	  }
	| { kind: "string"; optional: boolean };

export function compareSchemas(
	a: NormalizedSchema,
	b: NormalizedSchema,
	path = "",
): string[] {
	const errors = Array<string>();

	if (a.kind !== "any" && b.kind !== "any" && a.kind !== b.kind) {
		errors.push(`Type mismatch at ${path}: ${a.kind} vs ${b.kind}`);
		return errors;
	}

	if (a.kind === "object" && b.kind === "object") {
		for (const key of Object.keys(a.shape)) {
			if (!(key in b.shape)) {
				errors.push(`Missing key '${key}' at ${path}`);
				continue;
			}
			errors.push(
				...compareSchemas(a.shape[key], b.shape[key], `${path}.${key}`),
			);
		}
	}

	if (a.kind === "array" && b.kind === "array") {
		errors.push(...compareSchemas(a.element, b.element, `${path}[]`));
	}

	return errors;
}

export function normalizeStandardSchema(node: StandardSchemaV1) {
	switch (node["~standard"].vendor) {
		case "arktype":
			return normalizeArkType(node);
		case "valibot":
			return normalizeValibotSchema(node);
		case "zod":
			return normalizeZodSchema(node);
		default:
			throw new Error(
				"invalid schema provider used please pick one of arktype, valibot or zod",
			);
	}
}

function normalizeArkType(node: any): NormalizedSchema {
	const optional = node.optional === true;

	switch (node.kind) {
		case "any":
			return { kind: "any", optional };

		case "array":
			return {
				element: normalizeArkType(node.element),
				kind: "array",
				optional,
			};

		case "boolean":
			return { kind: "boolean", optional };

		case "number":
			return { kind: "number", optional };

		case "object": {
			const shape: Record<string, NormalizedSchema> = {};

			for (const [key, value] of Object.entries<object>(
				node.props ?? {},
			)) {
				shape[key] = normalizeArkType({
					...value,
					optional: node.optional?.has?.(key) ?? false,
				});
			}

			return { kind: "object", optional, shape };
		}

		case "string":
			return { kind: "string", optional };

		case "union":
			return { kind: "any", optional };

		default:
			return { kind: "any", optional };
	}
}

function normalizeHandlebarsSchema(node: any): NormalizedSchema {
	const optional = Boolean(node._optional);

	switch (node._type) {
		case "any":
			return { kind: "any", optional };

		case "array":
			return {
				element: normalizeHandlebarsSchema(node["#"]),
				kind: "array",
				optional,
			};

		case "object": {
			const shape: Record<string, NormalizedSchema> = {};

			for (const [key, value] of Object.entries(node)) {
				if (key.startsWith("_")) continue;
				shape[key] = normalizeHandlebarsSchema(value);
			}

			return { kind: "object", optional, shape };
		}

		default:
			throw new Error(`Unknown handlebars type: ${node._type}`);
	}
}

function normalizeValibotSchema(schema: any): NormalizedSchema {
	switch (schema.kind) {
		case "array":
			return {
				element: normalizeValibotSchema(schema.item),
				kind: "array",
				optional: false,
			};

		case "boolean":
			return { kind: "boolean", optional: false };

		case "number":
			return { kind: "number", optional: false };

		case "object": {
			const shape: Record<string, NormalizedSchema> = {};

			for (const [key, value] of Object.entries(schema.entries ?? {})) {
				shape[key] = normalizeValibotSchema(value);
			}

			return { kind: "object", optional: false, shape };
		}

		case "optional": {
			const inner = normalizeValibotSchema(schema.wrapped);
			return { ...inner, optional: true };
		}

		case "string":
			return { kind: "string", optional: false };

		default:
			return { kind: "any", optional: false };
	}
}

function normalizeZodSchema(node: any): NormalizedSchema {
	const def = node.def;

	switch (def.type) {
		case "array":
			return {
				element: normalizeZodSchema(def.element),
				kind: "array",
				optional: false,
			};

		case "object": {
			const shape: Record<string, NormalizedSchema> = {};

			for (const [key, value] of Object.entries(def.shape ?? {})) {
				shape[key] = normalizeZodSchema(value);
			}

			return { kind: "object", optional: false, shape };
		}

		case "string":
			return { kind: "string", optional: false };

		default:
			return { kind: "any", optional: false };
	}
}

export {
	normalizeHandlebarsSchema as handlebarSchema,
	normalizeStandardSchema as standardSchema,
};
