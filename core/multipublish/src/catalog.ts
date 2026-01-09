import { findRoot } from "@manypkg/find-root";
import { getPackages, type Package } from "@manypkg/get-packages";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import * as yaml from "yaml";
import * as z from "zod";

import type { AgentName } from "./detect";

export type CatalogSchema = z.infer<typeof catalogSchema>;
export const catalogSchema = z.object({
	catalog: z.record(z.string(), z.string()).optional(),
	catalogs: z.record(z.string(), z.record(z.string(), z.string())).optional(),
});

export type ValidCatalogAgent = Extract<AgentName, "bun" | "pnpm">;
export const catalogLoadMap = {
	bun: loadBunCatalogs,
	pnpm: loadPnpmCatalogs,
} satisfies Record<ValidCatalogAgent, () => Promise<CatalogSchema>>;

export async function loadBunCatalogs() {
	const { rootDir } = await findRoot(process.cwd());
	const { rootPackage } = await getPackages(rootDir);
	const packageJson = rootPackage?.packageJson;
	const catalogs = catalogSchema.parse(packageJson);
	return catalogs;
}

export async function loadPnpmCatalogs() {
	const { rootDir } = await findRoot(process.cwd());
	const workspacePath = path.join(rootDir, "pnpm-workspace.yaml");
	const workspaceFile = await fsp.readFile(workspacePath, {
		encoding: "utf-8",
	});
	const catalogs = catalogSchema.parse(yaml.parse(workspaceFile));
	return catalogs;
}

export function loadVersion({
	catalogs,
	dependency,
	version,
}: {
	catalogs: CatalogSchema;
	dependency: string;
	version: string;
}) {
	if (!version.includes("catalog:")) return version;
	const [_, catalogName] = version.split("catalog:");
	const currentCatalog = catalogName
		? catalogs.catalogs?.[catalogName]
		: catalogs.catalog;

	const catalogVersion = currentCatalog?.[dependency];
	if (!catalogVersion) {
		throw new Error(
			`no catalog version found for named catalog (${catalogName || "default"}) dependency (${dependency})`,
		);
	}

	return catalogVersion;
}

export async function updatePackageJsonWithCatalog(
	pkg: Package,
	agent: ValidCatalogAgent,
) {
	const catalogStrategy = catalogLoadMap[agent];
	const catalogs = await catalogStrategy();

	for (const dependencyType of ["dependencies", "devDependencies"] as const) {
		for (const [dependency, version] of Object.entries(
			pkg.packageJson[dependencyType] || {},
		)) {
			pkg.packageJson[dependencyType] ??= {};
			pkg.packageJson[dependencyType][dependency] = loadVersion({
				catalogs,
				dependency,
				version,
			});
		}
	}

	const packageJsonPath = path.join(pkg.dir, "package.json");
	const packageJsonFile = JSON.stringify(pkg.packageJson, undefined, 2);
	await fsp.writeFile(packageJsonPath, packageJsonFile);
}
