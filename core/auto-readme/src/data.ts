import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { readPackageJSON } from "pkg-types";
import * as yaml from "yaml";
import { zod2md } from "zod2md";

import type { AstComments } from "./comment";

import { fileExists } from "./utils";

export type ActionData = Awaited<ReturnType<typeof loadActionData>>;

type ActionInput = {
	default?: string;
	description?: string;
	required?: boolean;
};

type ActionYaml = { inputs?: Record<string, ActionInput> };

export function createFindParameter(parameterList: string[]) {
	return function (parameterName: string) {
		return parameterList
			?.find((p) => p.startsWith(parameterName))
			?.replace(parameterName + "=", "")
			?.replace(/"/gi, "")
			?.replace(/_/gi, " ");
	};
}

export async function loadActionData(
	actions: AstComments,
	file: string,
	root: string,
) {
	const startActions = actions.filter((action) => action.isStart);
	return await Promise.all(
		startActions.map(async (action) => {
			const find = createFindParameter(action.parameters);
			switch (action.action) {
				case "ACTION": {
					const baseDir = path.dirname(file);
					const actionYaml = await loadActionYaml(baseDir);
					return {
						action: action.action,
						actionYaml,
						parameters: action.parameters,
					};
				}

				case "PKG": {
					const inputPath = find("path");
					const filename = inputPath
						? path.resolve(path.dirname(file), inputPath)
						: path.dirname(file);
					const pkgJson = await readPackageJSON(filename);
					return {
						action: action.action,
						parameters: action.parameters,
						pkgJson,
					};
				}

				case "USAGE": {
					return {
						action: action.action,
						parameters: action.parameters,
					};
				}

				case "WORKSPACE": {
					const workspaces = await getPackages(process.cwd());
					const pnpmPath = path.resolve(root, "pnpm-workspace.yaml");
					const isPnpm = fs.existsSync(pnpmPath);
					return {
						action: action.action,
						isPnpm,
						parameters: action.parameters,
						root,
						workspaces,
					};
				}

				case "ZOD": {
					if (action.format === "LIST") {
						throw new Error("cannot display zod in list format");
					}

					const inputPath = find("path");
					if (!inputPath) {
						const error = `no path found for zod table at markdown file ${file}`;
						throw new Error(error);
					}

					const body = await zod2md({
						entry: path.resolve(path.dirname(file), inputPath),
						title: find("title") || "Zod Schema",
					});

					return {
						action: action.action,
						body,
						parameters: action.parameters,
					};
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
		((await fileExists(actionYamlPath)) && actionYamlPath) ||
		((await fileExists(actionYmlPath)) && actionYmlPath);

	if (!actualPath) {
		const locations = [actionYmlPath, actionYamlPath];
		const error = `no yaml file found at locations: ${locations}`;
		throw new Error(error);
	}

	const actionFile = await fsp.readFile(actualPath, { encoding: "utf8" });

	return yaml.parse(actionFile) as ActionYaml;
}
