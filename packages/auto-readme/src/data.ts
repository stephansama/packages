import type { PackageJson } from "type-fest";

import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import type { loadAstComments } from "./comment";

const sh = String.raw;

type PackageManager = "npm" | "pnpm" | "yarn";

const packageManagerPaths: Record<PackageManager, string> = {
	npm: "package-lock.json",
	pnpm: "pnpm-lock.yaml",
	yarn: "yarn.lock",
} as const;

const workspaceCommands: Record<PackageManager, string> = {
	npm: sh`npm ls --json --depth=0 --workspaces`,
	pnpm: sh`pnpm list --recursive --depth 0 --json`,
	yarn: sh`yarn workspaces foreach --all --json --verbose run yarn list --json --depth=0`,
} as const;

export type ActionData = Awaited<ReturnType<typeof loadActionData>>;

export function determinePackageManager(root: string): PackageManager {
	const found = Object.entries(packageManagerPaths).find(([, value]) => {
		return fs.existsSync(path.resolve(root, value));
	})?.[0];

	if (!found) {
		throw new Error("not able to find package manager");
	}

	return found as PackageManager;
}

export async function loadActionData(
	actions: ReturnType<typeof loadAstComments>,
	file: string,
	root: string,
) {
	const startActions = actions.filter((action) => action.isStart);
	return await Promise.all(
		startActions.map(async (action) => {
			switch (action.action) {
				case "PKG": {
					const pkgJsonPath = path.resolve(
						path.dirname(file),
						"package.json",
					);
					const pkgJsonFile = await fsp.readFile(pkgJsonPath, {
						encoding: "utf8",
					});
					const pkgJson = JSON.parse(pkgJsonFile) as PackageJson;
					return { action: action.action, pkgJson };
				}
				case "WORKSPACE": {
					const manager = determinePackageManager(root);
					const workspace = await loadWorkspace(manager);
					return { action: action.action, manager, workspace };
				}
				default:
					throw new Error("feature not yet implemented");
			}
		}),
	);
}

export async function loadWorkspace(manager: PackageManager) {
	const encoding: BufferEncoding = "utf8";

	if (manager === "yarn") {
		throw new Error("yarn is currently not supported");
	}

	if (manager === "pnpm") {
		const output = cp.execSync(workspaceCommands.pnpm, { encoding }).trim();
		const json: PackageJson[] = JSON.parse(output);
		return json.map((o) => {
			delete o.dependencies;
			delete o.devDependencies;
			return o;
		});
	}

	if (manager === "npm") {
		const output = cp.execSync(workspaceCommands.npm, { encoding }).trim();

		throw new Error("npm is not fully supported");
	}
}
