import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { readPackageJSON } from "pkg-types";
import * as yaml from "yaml";
import { zod2md } from "zod2md";

import type { loadAstComments } from "./comment";

export type ActionData = Awaited<ReturnType<typeof loadActionData>>;

export type ActionTableHeading = "name" | keyof ActionInput;

export type ActionYaml = { inputs?: Record<string, ActionInput> };

type ActionInput = {
	default?: string;
	description?: string;
	required?: boolean;
};

export async function loadActionData(
	actions: ReturnType<typeof loadAstComments>,
	file: string,
	root: string,
) {
	const startActions = actions.filter((action) => action.isStart);
	return await Promise.all(
		startActions.map(async (action) => {
			switch (action.action) {
				case "ACTION": {
					const baseDir = path.dirname(file);
					const actionYaml = await loadActionYaml(baseDir);
					return { action: action.action, actionYaml };
				}

				case "PKG": {
					const pkgJson = await readPackageJSON(path.dirname(file));
					return { action: action.action, pkgJson };
				}

				case "WORKSPACE": {
					const workspaces = await getPackages(process.cwd());
					const pnpmWorkspacePath = path.resolve(
						root,
						"pnpm-workspace.yaml",
					);
					const isPnpm = fs.existsSync(pnpmWorkspacePath);
					return { action: action.action, isPnpm, root, workspaces };
				}

				case "ZOD": {
					if (action.format === "LIST") {
						throw new Error("cannot display zod in list format");
					}

					const entry = parseParameter(action.parameters, "path");
					if (!entry) {
						const error = `no path found for zod table at markdown file ${file}`;
						throw new Error(error);
					}

					const title =
						parseParameter(action.parameters, "title") ||
						"Zod Schema";

					const body = await zod2md({ entry, title });

					return { action: action.action, body };
				}

				default:
					throw new Error("feature not yet implemented");
			}
		}),
	);
}

async function loadActionYaml(baseDir: string) {
	const actionYmlPath = path.resolve(baseDir, "action.yml");
	const actionYamlPath = path.resolve(baseDir, "action.yaml");
	const actualPath =
		(fs.existsSync(actionYamlPath) && actionYamlPath) ||
		(fs.existsSync(actionYmlPath) && actionYmlPath);

	if (!actualPath) {
		const locations = [actionYmlPath, actionYamlPath];
		const error = `no yaml file found at locations: ${locations}`;
		throw new Error(error);
	}

	const actionFile = await fsp.readFile(actualPath, { encoding: "utf8" });

	return yaml.parse(actionFile) as ActionYaml;
}

function parseParameter(parameterList: string[], parameterName: string) {
	return parameterList
		.find((p) => p.startsWith(parameterName))
		?.replace(parameterName + "=", "")
		.replace(/"/gi, "")
		.replace("_", " ");
}
