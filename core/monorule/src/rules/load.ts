import * as fs from "node:fs";
import path from "node:path";
import { register } from "tsx/esm/api";

import { info } from "@/log";
import { type ConfigSchema, ruleMapSchema, type RuleMapSchema } from "@/schema";

// explicit return type so the emitted d.ts names the type instead of inlining
// the inferred zod union, whose member order is not stable between builds
export async function loadRules(
	config: ConfigSchema,
	configFilepath?: string,
): Promise<RuleMapSchema[string][]> {
	const absolute = path.resolve(
		path.join(path.dirname(configFilepath || ""), config.ruleDirectory),
	);

	if (!fs.existsSync(absolute)) return [];

	const files = await fs.promises.readdir(absolute);

	const unregister = register();

	const loadedRules = await Promise.all(
		files.map(async (file) => {
			info(`loading ${file}`);
			// convert to object to remove module namespace key
			const imported = (await import(
				path.join(absolute, file)
			)) as Record<string, unknown>;
			return Object.values(ruleMapSchema.parse({ ...imported }));
		}),
	);

	await unregister();

	return loadedRules.flat();
}
