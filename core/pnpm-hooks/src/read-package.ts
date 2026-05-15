import type { ReadPackageHook } from "./types";

const versionRegex = /^[~^]/;

function removePackageUpdates(version: string) {
	return version.trim().replace(versionRegex, "");
}

/** Pin all dependencies in a pnpm workspace (including nested dependencies) */
export const pinAllDependencies = ((pkg, _context) => {
	if (pkg.devDependencies) {
		for (const [dependency, value] of Object.entries(pkg.devDependencies)) {
			pkg.devDependencies[dependency] = removePackageUpdates(value);
		}
	}

	if (pkg.dependencies) {
		for (const [dependency, value] of Object.entries(pkg.dependencies)) {
			pkg.dependencies[dependency] = removePackageUpdates(value);
		}
	}

	return pkg;
}) satisfies ReadPackageHook;
