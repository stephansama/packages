import { findRoot } from "@manypkg/find-root";
import * as fs from "node:fs/promises";
import path from "node:path";
import { Document, parseDocument } from "yaml";

export const WORKSPACE_FILE = "pnpm-workspace.yaml";

export async function loadWorkspace(
	filepath: string,
): Promise<Document.Parsed> {
	const source = await fs.readFile(filepath, "utf8");
	return parseDocument(source);
}

export async function resolveWorkspacePath(override?: string): Promise<string> {
	if (override) return path.resolve(override);
	const { rootDir } = await findRoot(process.cwd());
	return path.join(rootDir, WORKSPACE_FILE);
}

export async function saveWorkspace(
	filepath: string,
	document: Document,
): Promise<void> {
	await fs.writeFile(filepath, document.toString(), "utf8");
}
