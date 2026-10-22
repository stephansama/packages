import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import * as yaml from "yaml";
import { zod2md } from "zod2md";

import type { AstComments } from "./comment";

import { INFO } from "./log";
import { fileExists, loadCatalogs } from "./utilities";

export type ActionData = Awaited<ReturnType<typeof loadActionData>>;

export type McpJson = { mcpServers?: Record<string, McpServer> };

export type McpServer = {
	args?: string[];
	command?: string;
	type?: string;
	url?: string;
};

export type Skill = {
	skillPath?: string;
	source?: string;
	sourceType?: string;
};

export type SkillsLock = { skills?: Record<string, Skill> };

type ActionInput = {
	default?: string;
	description?: string;
	required?: boolean;
};

type ActionYaml = { inputs?: Record<string, ActionInput> };

const MCP_FILE = ".mcp.json";
const SKILLS_LOCK_FILE = "skills-lock.json";

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
					const mcp = await loadJsonBesideReadme<McpJson>(
						file,
						MCP_FILE,
					);
					const skills = await loadJsonBesideReadme<SkillsLock>(
						file,
						SKILLS_LOCK_FILE,
					);
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

async function loadActionYaml(baseDirectory: string) {
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

/** Load an optional json file that lives in the same directory as the readme */
async function loadJsonBesideReadme<T>(
	readme: string,
	filename: string,
): Promise<T | undefined> {
	const filePath = path.resolve(path.dirname(readme), filename);

	if (!(await fileExists(filePath))) return;

	INFO(`found ${filename} next to readme`, filePath);

	const contents = await fsp.readFile(filePath, { encoding: "utf8" });

	return JSON.parse(contents) as T;
}
