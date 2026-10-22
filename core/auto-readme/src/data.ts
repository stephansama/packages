import type { ParseError } from "jsonc-parser";

import { getPackages } from "@manypkg/get-packages";
import { parse as parseJSONC, printParseErrorCode } from "jsonc-parser";
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
	ref?: string;
	skillPath?: string;
	source?: string;
	sourceType?: string;
	sourceUrl?: string;
};

export type SkillsLock = { skills?: Record<string, Skill> };

type ActionInput = {
	default?: string;
	description?: string;
	required?: boolean;
};

type ActionYaml = { inputs?: Record<string, ActionInput> };

type McpConfigFile = {
	/** Path relative to the readme */
	file: string;
	/** Normalize the tool specific shape into `mcpServers` */
	servers: (json: unknown) => Record<string, McpServer> | undefined;
};

type RawServer = Record<string, unknown>;

const SKILLS_LOCK_FILE = "skills-lock.json";

/**
 * Project scoped mcp configuration files that live next to a readme, in
 * priority order. Only json (and jsonc) files are supported; toml based configs
 * such as `.codex/config.toml` and yaml based configs such as
 * `.continue/config.yaml` are intentionally not read.
 */
export const MCP_CONFIG_FILES: McpConfigFile[] = [
	// claude code
	{ file: ".mcp.json", servers: fromMcpServers },
	// claude code plugins
	{ file: ".claude-plugin/plugin.json", servers: fromMcpServers },
	// cursor
	{ file: ".cursor/mcp.json", servers: fromMcpServers },
	// vs code / github copilot
	{ file: ".vscode/mcp.json", servers: fromVsCode },
	// gemini cli
	{ file: ".gemini/settings.json", servers: fromGemini },
	// roo code
	{ file: ".roo/mcp.json", servers: fromMcpServers },
	// kiro
	{ file: ".kiro/settings/mcp.json", servers: fromMcpServers },
	// amazon q developer
	{ file: ".amazonq/mcp.json", servers: fromMcpServers },
	// opencode
	{ file: "opencode.json", servers: fromOpenCode },
	{ file: "opencode.jsonc", servers: fromOpenCode },
	// zed
	{ file: ".zed/settings.json", servers: fromZed },
];

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
						: await loadJsonBesideReadme<SkillsLock>(
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

function fromGemini(json: unknown) {
	const servers = pickRecord(json, "mcpServers");
	if (!servers) return;
	// gemini uses `httpUrl` for streamable http servers and `url` for sse
	return normalizeServers(
		Object.fromEntries(
			Object.entries(servers).map(([name, server]) => [
				name,
				isRecord(server)
					? { ...server, url: server.url || server.httpUrl }
					: server,
			]),
		),
	);
}

function fromMcpServers(json: unknown) {
	return normalizeServers(pickRecord(json, "mcpServers"));
}

function fromOpenCode(json: unknown) {
	const servers = pickRecord(json, "mcp");
	if (!servers) return;
	return normalizeServers(
		Object.fromEntries(
			Object.entries(servers).map(([name, server]) => {
				// opencode: `command` is the full argv array
				const [command, ...rest] = pickStrings(server, "command") || [];
				const type = pickString(server, "type");
				return [
					name,
					{
						args: rest,
						command,
						type: type === "remote" ? "http" : "stdio",
						url: pickString(server, "url"),
					},
				];
			}),
		),
	);
}

function fromVsCode(json: unknown) {
	return normalizeServers(pickRecord(json, "servers"));
}

function fromZed(json: unknown) {
	const servers = pickRecord(json, "context_servers");
	if (!servers) return;
	return normalizeServers(
		Object.fromEntries(
			Object.entries(servers).flatMap(([name, server]) => {
				// servers provided by zed extensions have no command of their own
				if (pickString(server, "source") === "extension") return [];
				// older zed versions nest the command: { command: { path, args } }
				const nested = pickRecord(server, "command");
				if (!nested) return [[name, server]];
				const normalized = {
					args: pickStrings(nested, "args"),
					command: pickString(nested, "path"),
				};
				return [[name, normalized]];
			}),
		),
	);
}

function isRecord(input: unknown): input is RawServer {
	return typeof input === "object" && input !== null && !Array.isArray(input);
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

	// jsonc so that files like opencode.jsonc or .vscode/mcp.json may contain
	// comments and trailing commas
	const errors: ParseError[] = [];
	const parsed = parseJSONC(contents, errors, {
		allowEmptyContent: false,
		allowTrailingComma: true,
	}) as T;

	const [first] = errors;
	if (first) {
		const reason = printParseErrorCode(first.error);
		throw new Error(
			`unable to parse ${filePath}: ${reason} at offset ${first.offset}`,
		);
	}

	return parsed;
}

/**
 * Merge every supported mcp configuration file found next to the readme.
 * Earlier files in {@link MCP_CONFIG_FILES} win when a server name repeats.
 */
async function loadMcpServers(readme: string): Promise<McpJson | undefined> {
	const mcpServers: Record<string, McpServer> = {};
	let found = false;

	for (const { file, servers } of MCP_CONFIG_FILES) {
		const json = await loadJsonBesideReadme<unknown>(readme, file);
		if (json === undefined) continue;
		found = true;
		for (const [name, server] of Object.entries(servers(json) || {})) {
			mcpServers[name] ??= server;
		}
	}

	if (!found) return;

	return { mcpServers };
}

function normalizeServers(servers: RawServer | undefined) {
	if (!servers) return;
	return Object.fromEntries(
		Object.entries(servers).flatMap(([name, server]) => {
			if (!isRecord(server)) return [];
			const normalized: McpServer = {
				args: pickStrings(server, "args"),
				command: pickString(server, "command"),
				type: pickString(server, "type"),
				url: pickString(server, "url"),
			};
			return [[name, normalized]];
		}),
	);
}

function pickRecord(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	return isRecord(value) ? value : undefined;
}

function pickString(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	return typeof value === "string" ? value : undefined;
}

function pickStrings(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	if (!Array.isArray(value)) return;
	return value.every((v): v is string => typeof v === "string")
		? value
		: undefined;
}
