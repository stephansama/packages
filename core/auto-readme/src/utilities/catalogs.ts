import { findRoot } from "@manypkg/find-root";
import * as fs from "node:fs";
import path from "node:path";
import * as yaml from "yaml";

import type { BunWorkspace, LoadedCatalogs, Workspace } from "./types";

/** Load pnpm (or bun) catalogs from the workspace root */
export async function loadCatalogs(): Promise<LoadedCatalogs> {
	const { rootDir } = await findRoot(process.cwd());
	const pnpmWorkspacePath = path.join(rootDir, "pnpm-workspace.yaml");

	if (fs.existsSync(pnpmWorkspacePath)) {
		const file = await fs.promises.readFile(pnpmWorkspacePath, "utf8");
		const parsed = yaml.parse(file) as Workspace;

		return {
			catalogs: parsed.catalogs,
			default: parsed.catalog,
		};
	}

	const rootJsonPath = path.join(rootDir, "package.json");
	const rootJsonFile = await fs.promises.readFile(rootJsonPath, "utf8");
	const rootPackageJson = JSON.parse(rootJsonFile) as BunWorkspace;

	return {
		catalogs: rootPackageJson?.workspaces?.catalogs,
		default: rootPackageJson?.workspaces?.catalog,
	};
}

/** Replace a `catalog:` version specifier with the pinned catalog version */
export function resolveVersion({
	catalogs,
	name,
	version,
}: {
	catalogs?: LoadedCatalogs;
	name: string;
	version: string;
}) {
	if (!version.startsWith("catalog:")) return version;

	if (!version.endsWith(":")) {
		const catalogName = version.split(":").at(-1);
		const pulled =
			catalogs?.catalogs?.[
				catalogName as keyof typeof catalogs.catalogs
			]?.[name];
		if (pulled) return pulled;
	}

	const defaultVersion = catalogs?.default?.[name];
	if (defaultVersion) return defaultVersion;

	return version;
}
