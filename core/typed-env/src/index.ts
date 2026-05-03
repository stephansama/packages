import type { StandardSchemaV1 } from "@standard-schema/spec";

import dotenvx from "@dotenvx/dotenvx";
import * as fsp from "node:fs/promises";

export function createEnvironment<Schema extends StandardSchemaV1>(
	schema: Schema,
	loadEnvironmentConfig?: dotenvx.DotenvConfigOptions | true,
) {
	function loadEnvironment(options?: dotenvx.DotenvConfigOptions) {
		return dotenvx.config(options);
	}

	if (loadEnvironmentConfig) {
		const config =
			typeof loadEnvironmentConfig === "object"
				? loadEnvironmentConfig
				: { quiet: true };

		loadEnvironment(config);
	}

	return {
		async generateExample(path: string) {
			await fsp.writeFile(path, "");

			for (const key of Object.keys(getObjectFromSchema(schema))) {
				dotenvx.set(key, "***", { encrypt: false, path });
			}
		},
		loadEnv: loadEnvironment,
		schema,
		async validate({
			env: environment = process.env,
		}: { env?: Record<string, string | undefined> } = {}): Promise<
			StandardSchemaV1.InferOutput<Schema>
		> {
			const result = await Promise.resolve(
				schema["~standard"].validate(environment),
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

function getObjectFromSchema(node: StandardSchemaV1): object {
	switch (node["~standard"].vendor) {
		case "arktype": {
			return (node as unknown as { definition: object }).definition;
		}
		case "valibot": {
			return (node as unknown as { entries: object }).entries;
		}
		case "zod": {
			return (node as unknown as { shape: object }).shape;
		}
		default: {
			throw new Error(
				"invalid schema provider used please pick one of arktype, valibot or zod",
			);
		}
	}
}
