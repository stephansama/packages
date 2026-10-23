import * as fsp from "node:fs/promises";
import * as os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import type { AstComments } from "./comment";

import { loadActionData } from "./data";

vi.mock("./log", () => ({ ERROR: vi.fn(), INFO: vi.fn(), WARN: vi.fn() }));
vi.mock("./utilities", async (importOriginal) => ({
	...(await importOriginal<typeof import("./utilities")>()),
	// eslint-disable-next-line unicorn/no-useless-undefined
	loadCatalogs: vi.fn().mockResolvedValue(undefined),
}));

let directory: string;

beforeEach(async () => {
	directory = await fsp.mkdtemp(path.join(os.tmpdir(), "auto-readme-"));
	await fsp.writeFile(
		path.join(directory, "package.json"),
		JSON.stringify({ name: "demo", version: "1.0.0" }),
	);
});

afterEach(async () => {
	await fsp.rm(directory, { force: true, recursive: true });
});

const badge: AstComments = [
	{
		action: "BADGE",
		format: "TABLE",
		isStart: true,
		language: "JS",
		parameters: [],
	},
];

it("BADGE: loads .mcp.json and skills-lock.json next to the readme", async () => {
	const readme = path.join(directory, "README.md");
	const mcp = { mcpServers: { coolify: { type: "http", url: "https://x" } } };
	const skills = {
		skills: { demo: { source: "owner/repo", sourceType: "github" } },
		version: 1,
	};
	await fsp.writeFile(path.join(directory, ".mcp.json"), JSON.stringify(mcp));
	await fsp.writeFile(
		path.join(directory, "skills-lock.json"),
		JSON.stringify(skills),
	);

	const [result] = await loadActionData(badge, readme, directory);

	expect(result).toMatchObject({ action: "BADGE", mcp, skills });
});

it("BADGE: leaves mcp and skills undefined when the files are absent", async () => {
	const readme = path.join(directory, "README.md");

	const [result] = await loadActionData(badge, readme, directory);

	expect(result).toMatchObject({ action: "BADGE" });
	expect(result).not.toHaveProperty("mcp.mcpServers");
	expect(result).not.toHaveProperty("skills.skills");
});

it("BADGE: looks next to the readme even when path= points elsewhere", async () => {
	await fsp.mkdir(path.join(directory, "docs"));
	const readme = path.join(directory, "docs", "README.md");
	const mcp = { mcpServers: {} };
	await fsp.writeFile(
		path.join(directory, "docs", ".mcp.json"),
		JSON.stringify(mcp),
	);

	const [result] = await loadActionData(
		[{ ...badge[0], parameters: ['path="../"'] }],
		readme,
		directory,
	);

	expect(result).toMatchObject({ action: "BADGE", mcp });
	expect(result).not.toHaveProperty("skills.skills");
});

it("BADGE: names the file when a discovered json file is malformed", async () => {
	const readme = path.join(directory, "README.md");
	const file = path.join(directory, ".mcp.json");
	await fsp.writeFile(file, "{ mcpServers: }");

	await expect(loadActionData(badge, readme, directory)).rejects.toThrow(
		`unable to parse ${file}`,
	);
});

it("BADGE: does not read the files when --skip-mcp / --skip-skills are set", async () => {
	const readme = path.join(directory, "README.md");
	await fsp.writeFile(path.join(directory, ".mcp.json"), "not json");
	await fsp.writeFile(path.join(directory, "skills-lock.json"), "not json");

	const [result] = await loadActionData(
		[{ ...badge[0], parameters: ["--skip-mcp", "--skip-skills"] }],
		readme,
		directory,
	);

	expect(result).toMatchObject({ action: "BADGE" });
	expect(result).not.toHaveProperty("mcp.mcpServers");
	expect(result).not.toHaveProperty("skills.skills");
});

async function loadServers() {
	const readme = path.join(directory, "README.md");
	const [result] = await loadActionData(badge, readme, directory);
	return (result as { mcp?: { mcpServers?: Record<string, unknown> } }).mcp
		?.mcpServers;
}

async function write(relative: string, contents: string) {
	const file = path.join(directory, relative);
	await fsp.mkdir(path.dirname(file), { recursive: true });
	await fsp.writeFile(file, contents);
}

it("MCP: reads the mcpServers shape used by cursor, roo, kiro, amazon q and claude plugins", async () => {
	await write(
		".cursor/mcp.json",
		JSON.stringify({
			mcpServers: { cursor: { args: ["a"], command: "npx" } },
		}),
	);
	await write(
		".roo/mcp.json",
		JSON.stringify({ mcpServers: { roo: { url: "https://roo" } } }),
	);
	await write(
		".kiro/settings/mcp.json",
		JSON.stringify({ mcpServers: { kiro: { command: "uvx" } } }),
	);
	await write(
		".amazonq/mcp.json",
		JSON.stringify({ mcpServers: { q: { command: "q" } } }),
	);
	await write(
		".claude-plugin/plugin.json",
		JSON.stringify({
			mcpServers: { plugin: { command: "p" } },
			name: "plugin",
		}),
	);

	expect(await loadServers()).toEqual({
		cursor: { args: ["a"], command: "npx" },
		kiro: { command: "uvx" },
		plugin: { command: "p" },
		q: { command: "q" },
		roo: { url: "https://roo" },
	});
});

it("MCP: reads the vs code `servers` shape", async () => {
	await write(
		".vscode/mcp.json",
		JSON.stringify({
			inputs: [{ id: "token", type: "promptString" }],
			servers: {
				code: {
					headers: { a: "b" },
					type: "http",
					url: "https://code",
				},
				local: { args: ["s.js"], command: "node", type: "stdio" },
			},
		}),
	);

	expect(await loadServers()).toEqual({
		code: { type: "http", url: "https://code" },
		local: { args: ["s.js"], command: "node", type: "stdio" },
	});
});

it("MCP: reads gemini settings and maps httpUrl to url", async () => {
	await write(
		".gemini/settings.json",
		JSON.stringify({
			mcpServers: {
				sse: { url: "https://gemini/sse" },
				streamable: { httpUrl: "https://gemini/http" },
			},
			theme: "dark",
		}),
	);

	expect(await loadServers()).toEqual({
		sse: { url: "https://gemini/sse" },
		streamable: { url: "https://gemini/http" },
	});
});

it("MCP: reads opencode json and jsonc with argv style commands", async () => {
	await write(
		"opencode.jsonc",
		`{
			// comments are allowed in jsonc
			"mcp": {
				"local": { "type": "local", "command": ["bun", "x", "server"], "enabled": true },
				"remote": { "type": "remote", "url": "https://opencode" },
			},
		}`,
	);

	expect(await loadServers()).toEqual({
		local: { args: ["x", "server"], command: "bun", type: "stdio" },
		remote: { args: [], type: "http", url: "https://opencode" },
	});
});

it("MCP: reads zed context_servers in both shapes and skips extension servers", async () => {
	await write(
		".zed/settings.json",
		JSON.stringify({
			context_servers: {
				fromExtension: { settings: {}, source: "extension" },
				legacy: { command: { args: ["legacy.js"], path: "node" } },
				modern: {
					args: ["modern.js"],
					command: "node",
					source: "custom",
				},
			},
		}),
	);

	expect(await loadServers()).toEqual({
		legacy: { args: ["legacy.js"], command: "node" },
		modern: { args: ["modern.js"], command: "node" },
	});
});

it("MCP: merges every file and lets .mcp.json win on duplicate names", async () => {
	await write(
		".mcp.json",
		JSON.stringify({ mcpServers: { shared: { url: "https://claude" } } }),
	);
	await write(
		".cursor/mcp.json",
		JSON.stringify({
			mcpServers: {
				only: { command: "c" },
				shared: { url: "https://cursor" },
			},
		}),
	);

	expect(await loadServers()).toEqual({
		only: { command: "c" },
		shared: { url: "https://claude" },
	});
});

it("MCP: ignores malformed server entries", async () => {
	await write(
		".mcp.json",
		JSON.stringify({ mcpServers: { bad: "nope", ok: { command: "x" } } }),
	);

	expect(await loadServers()).toEqual({ ok: { command: "x" } });
});
