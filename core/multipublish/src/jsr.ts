import * as z from "zod";

export const exportSchema = z.string().or(
	z.record(
		z.string(),
		z.string().or(
			z.object({
				import: z.object({ default: z.string() }),
				require: z.object({ default: z.string() }),
			}),
		),
	),
);

export const packageJsonSchema = z.object({
	exports: exportSchema,
	license: z.string().optional(),
	name: z.string().min(1),
	version: z.string(),
});

export const jsrTransformer = packageJsonSchema.transform((schema) => ({
	exports: convertPkgJsonExportsToJsr(schema.exports),
	license: schema.license,
	name: schema.name,
	version: schema.version,
}));

export type JsrSchema = z.infer<typeof jsrSchema>;
export const jsrSchema = z.object({
	exports: z
		.string()
		.or(z.array(z.string()))
		.or(z.record(z.string(), z.string())),
	license: z.string().optional(),
	name: z.string().min(1),
	version: z.string(),
});

function convertPkgJsonExportsToJsr(exports: z.infer<typeof exportSchema>) {
	if (typeof exports === "string") return exports;
	return Object.fromEntries(
		Object.entries(exports).map(([key, value]) => [
			key,
			typeof value === "string" ? value : value.import.default,
		]),
	);
}
