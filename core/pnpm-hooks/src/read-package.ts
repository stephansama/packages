import type { BaseManifest } from "@pnpm/types";

import type { ReadPackageHook } from "./types";

const versionRegex = /^[~^]/;

function removePackageUpdates(version: string) {
	return version.trim().replace(versionRegex, "");
}

const dependencyTypes = [
	"dependencies",
	"devDependencies",
	"optionalDependencies",
] as const satisfies Array<
	keyof Pick<
		BaseManifest,
		"dependencies" | "devDependencies" | "optionalDependencies"
	>
>;

/** Pin all dependencies in a pnpm workspace (including nested dependencies) */
export const pinAllDependencies = ((pkg, _context) => {
	for (const current of dependencyTypes) {
		const dependencies = pkg[current];
		if (!dependencies) continue;

		for (const [dependency, value] of Object.entries(dependencies)) {
			dependencies[dependency] = removePackageUpdates(value);
		}
	}

	return pkg;
}) satisfies ReadPackageHook;
