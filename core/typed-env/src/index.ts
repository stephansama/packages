import type { StandardSchemaV1 } from "@standard-schema/spec";

import dotenvx from "@dotenvx/dotenvx";

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
		generateExample(path: string) {
			for (const key of Object.keys(schema)) {
				dotenvx.set(key, "***", { encrypt: false, path });
			}
		},
		loadEnv,
		schema,
		async validate(
			{
				env = process.env,
			}: {
				env: Record<string, string | undefined>;
			} = {
				env: process.env,
			},
		): Promise<StandardSchemaV1.InferOutput<Schema>> {
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
