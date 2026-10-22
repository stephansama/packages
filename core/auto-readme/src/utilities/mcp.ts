import type { McpConfigFile, McpJson, McpServer, RawRecord } from "./types";

import {
	isRecord,
	loadJsonBesideReadme,
	pickRecord,
	pickString,
	pickStrings,
} from "./json";

/**
 * Project scoped mcp configuration files that live next to a readme, in
 * priority order. Only json (and jsonc) files are supported; toml based configs
 * such as `.codex/config.toml` and yaml based configs such as
 * `.continue/config.yaml` are intentionally not read.
 */
export const MCP_CONFIG_FILES = [
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
] as const satisfies McpConfigFile[];

/**
 * Public link for an mcp server. Credentials and query strings are stripped
 * since readmes are usually published further than the repository itself
 */
export function getMcpServerUrl(server: McpServer): string | undefined {
	if (!server.url) return;
	try {
		const url = new URL(server.url);
		url.username = "";
		url.password = "";
		url.search = "";
		url.hash = "";
		return url.href;
	} catch {
		return;
	}
}

/**
 * Merge every supported mcp configuration file found next to the readme.
 * Earlier files in {@link MCP_CONFIG_FILES} win when a server name repeats.
 */
export async function loadMcpServers(
	readme: string,
): Promise<McpJson | undefined> {
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

function normalizeServers(servers: RawRecord | undefined) {
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
