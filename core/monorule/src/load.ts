import * as fs from "node:fs";
import path from "node:path";
import { register } from "tsx/esm/api";

import { type ConfigSchema, ruleMapSchema } from "./schema";

export async function loadRules(config: ConfigSchema, configFilepath?: string) {
	const absolute = path.resolve(
		path.join(path.dirname(configFilepath || ""), config.ruleDirectory),
	);

	if (!fs.existsSync(absolute)) return [];

	const files = await fs.promises.readdir(absolute);

	const unregister = register();

	const loadedRules = await Promise.all(
		files.map(async (file) => {
			console.info(`loading ${file}`);
			// convert to object to remove module namespace key
			const imported = (await import(path.join(absolute, file))) as {};
			return Object.values(ruleMapSchema.parse({ ...imported }));
		}),
	);

	await unregister();

	return loadedRules.flat();
}
