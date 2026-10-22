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
