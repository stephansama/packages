import type { StandardSchemaV1 } from "@standard-schema/spec";

import dotenvx from "@dotenvx/dotenvx";
import * as fsp from "node:fs/promises";

export function createEnv<Schema extends StandardSchemaV1>(
	schema: Schema,
	loadEnvConfig?: dotenvx.DotenvConfigOptions | true | undefined,
) {
	function loadEnv(options?: dotenvx.DotenvConfigOptions | undefined) {
		return dotenvx.config(options);
	}

	if (loadEnvConfig) {
		const config =
			typeof loadEnvConfig === "object" ? loadEnvConfig : { quiet: true };

		loadEnv(config);
	}

	return {
		async generateExample(path: string) {
			await fsp.writeFile(path, "");

			for (const key of Object.keys(getObjectFromSchema(schema))) {
				dotenvx.set(key, "***", { encrypt: false, path });
			}
		},
		loadEnv,
		schema,
		async validate({
			env = process.env,
		}: { env?: Record<string, string | undefined> } = {}): Promise<
			StandardSchemaV1.InferOutput<Schema>
		> {
			const result = await Promise.resolve(
				schema["~standard"].validate(env),
			);

			if (result.issues) {
				const issues = JSON.stringify(result.issues, undefined, 2);
				throw new Error(
					`unable to validate env due to the following issues: ${issues}`,
				);
			}

			return result.value;
		},
	};
}

function getObjectFromSchema(node: StandardSchemaV1) {
	switch (node["~standard"].vendor) {
		case "arktype":
			return (node as unknown as any).definition;
		case "valibot":
			return (node as unknown as any).entries;
		case "zod":
			return (node as unknown as any).shape;
		default:
			throw new Error(
				"invalid schema provider used please pick one of arktype, valibot or zod",
			);
	}
}
