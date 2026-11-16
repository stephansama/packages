import { getPackages } from "@manypkg/get-packages";
import {
	pinnableDependencyTypes,
	pinVersion,
} from "@stephansama/pnpm-hooks/pin-version";
import * as fs from "node:fs";
import path from "node:path";

import type { DepType, Finding } from "./finding";

import { classifySpec } from "./classify";

export type Manifest = Partial<Record<DepType, Record<string, string>>> & {
	name?: string;
	version?: string;
};

export type ScanOptions = {
	/** Project root, or any directory inside it */
	cwd: string;
	depTypes: readonly DepType[];
	/** Only check workspace manifests, not third-party packages */
	workspaceOnly?: boolean;
};

/** Thrown when the project can't be scanned, such as before `pnpm install` */
export class ScanError extends Error {
	override name = "ScanError";
}

/** Every floating range in one manifest */
export function findingsFromManifest(
	manifest: Manifest,
	depTypes: readonly DepType[],
	resolve?: (dependency: string) => string | undefined,
): Finding[] {
	const findings: Finding[] = [];

	for (const depType of depTypes) {
		for (const [dependency, spec] of Object.entries(
			manifest[depType] ?? {},
		)) {
			const kind = classifySpec(spec);
			if (!kind) continue;

			findings.push({
				dependency,
				depType,
				kind,
				parent: manifest.name ?? "",
				parentVersion: manifest.version ?? "",
				pinnable: isPinnable(spec, depType),
				resolved: resolve?.(dependency),
				spec,
			});
		}
	}

	return findings;
}

/**
 * Find every floating range declared by the workspace packages and by each
 * package installed in `node_modules/.pnpm`, de-duplicated by `name@version`
 */
export async function scan(options: ScanOptions): Promise<Finding[]> {
	const { packages, rootDir, rootPackage } = await getPackages(options.cwd);

	const seen = new Set<string>();
	const findings: Finding[] = [];

	const visit = (manifest: Manifest, nodeModules: string) => {
		const id = `${manifest.name}@${manifest.version}`;
		if (seen.has(id)) return;
		seen.add(id);

		findings.push(
			...findingsFromManifest(manifest, options.depTypes, (dependency) =>
				readInstalledVersion(nodeModules, dependency),
			),
		);
	};

	const workspace = rootPackage ? [rootPackage, ...packages] : packages;
	for (const pkg of workspace) {
		visit(pkg.packageJson as Manifest, path.join(pkg.dir, "node_modules"));
	}

	if (options.workspaceOnly) return findings;

	const store = path.join(rootDir, "node_modules", ".pnpm");
	if (!fs.existsSync(store)) {
		throw new ScanError(
			`no pnpm virtual store at ${store}. Run \`pnpm install\` first, or pass --workspace-only`,
		);
	}

	for (const { directory, nodeModules } of listStorePackages(store)) {
		const manifest = readManifest(directory);
		if (manifest) visit(manifest, nodeModules);
	}

	return findings;
}

function isPinnable(spec: string, depType: DepType) {
	const pinnable: readonly string[] = pinnableDependencyTypes;
	return pinnable.includes(depType) && pinVersion(spec) !== spec.trim();
}

function listPackageNames(nodeModules: string) {
	const names: string[] = [];

	for (const name of fs.readdirSync(nodeModules)) {
		if (name.startsWith(".")) continue;

		if (name.startsWith("@")) {
			const scope = path.join(nodeModules, name);
			for (const scoped of fs.readdirSync(scope)) {
				names.push(`${name}/${scoped}`);
			}
			continue;
		}

		names.push(name);
	}

	return names;
}

/**
 * Packages that live in each `node_modules/.pnpm/<entry>/node_modules`. The
 * symlinks next to them point at other entries and are listed there instead.
 */
function* listStorePackages(store: string) {
	for (const entry of fs.readdirSync(store)) {
		const nodeModules = path.join(store, entry, "node_modules");
		if (!fs.existsSync(nodeModules)) continue;

		for (const name of listPackageNames(nodeModules)) {
			const directory = path.join(nodeModules, name);
			if (fs.lstatSync(directory).isSymbolicLink()) continue;
			yield { directory, nodeModules };
		}
	}
}

function readInstalledVersion(nodeModules: string, dependency: string) {
	return readManifest(path.join(nodeModules, dependency))?.version;
}

function readManifest(directory: string): Manifest | undefined {
	try {
		const file = fs.realpathSync(path.join(directory, "package.json"));
		return JSON.parse(fs.readFileSync(file, "utf8")) as Manifest;
	} catch {
		return undefined;
	}
}
