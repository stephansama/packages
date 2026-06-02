import * as fs from "node:fs";
import path from "node:path";
import { register } from "tsx/esm/api";

import type { ConfigSchema } from "./schema";

import { defineRule } from "./rule";

export async function loadRules(config: ConfigSchema, configFilepath?: string) {
	const absolute = path.resolve(
		path.join(path.dirname(configFilepath || ""), config.ruleDirectory),
	);

	if (!fs.existsSync(absolute)) return [];

	const files = await fs.promises.readdir(absolute);

	const unregister = register();

	const loadedRules = await Promise.all(
		files.map(async (file) => {
			console.info(`loading ${path.join(absolute, file)}`);
			return Object.values(
				(await import(path.join(absolute, file))) as Record<
					string,
					ReturnType<typeof defineRule>
				>,
			);
		}),
	);

	await unregister();

	return loadedRules.flat();
}
