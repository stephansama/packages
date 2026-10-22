import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import { zod2md } from "zod2md";

import type { AstComments } from "./comment";

import {
	loadActionYaml,
	loadCatalogs,
	loadMcpServers,
	loadSkillsLock,
} from "./utilities";

export type ActionData = Awaited<ReturnType<typeof loadActionData>>;

export function createFindParameter(parameterList: string[]) {
	return function (parameterName: string) {
		return parameterList
			?.find((p) => p.startsWith(parameterName))
			?.replace(parameterName + "=", "")
			?.replaceAll('"', "")
			?.replaceAll("_", " ");
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
					const baseDirectory = path.dirname(file);
					const actionYaml = await loadActionYaml(baseDirectory);
					return {
						action: action.action,
						actionYaml,
						parameters: action.parameters,
					};
				}

				case "BADGE": {
					const inputPath = find("path");
					const filename = inputPath
						? path.resolve(path.dirname(file), inputPath)
						: path.dirname(file);
					const pkgJson = await readPackageJSON(filename);
					const catalogs = await loadCatalogs();
					const mcp = action.parameters.includes("--skip-mcp")
						? undefined
						: await loadMcpServers(file);
					const skills = action.parameters.includes("--skip-skills")
						? undefined
						: await loadSkillsLock(file);
					return {
						action: action.action,
						catalogs: catalogs,
						mcp,
						parameters: action.parameters,
						pkgJson,
						skills,
					};
				}

				case "PKG": {
					const inputPath = find("path");
					const filename = inputPath
						? path.resolve(path.dirname(file), inputPath)
						: path.dirname(file);
					const pkgJson = await readPackageJSON(filename);
					const catalogs = await loadCatalogs();
					return {
						action: action.action,
						catalogs: catalogs,
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

				default: {
					throw new Error("feature not yet implemented");
				}
			}
		}),
	);
}
