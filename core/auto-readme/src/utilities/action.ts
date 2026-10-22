import * as fsp from "node:fs/promises";
import path from "node:path";
import * as yaml from "yaml";

import type { ActionYaml } from "./types";

import { fileExists } from "./files";

/** Load the github `action.yml` / `action.yaml` next to the readme */
export async function loadActionYaml(baseDirectory: string) {
	const actionYmlPath = path.resolve(baseDirectory, "action.yml");
	const actionYamlPath = path.resolve(baseDirectory, "action.yaml");
	const actualPath =
		((await fileExists(actionYamlPath)) && actionYamlPath) ||
		((await fileExists(actionYmlPath)) && actionYmlPath);

	if (!actualPath) {
		const locations = [actionYmlPath, actionYamlPath];
		const error = `no yaml file found at locations: ${locations.join(",")}`;
		throw new Error(error);
	}

	const actionFile = await fsp.readFile(actualPath, { encoding: "utf8" });

	return yaml.parse(actionFile) as ActionYaml;
}
