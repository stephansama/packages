import type { ReadPackageHook } from "./types";

import { pinnableDependencyTypes, pinVersion } from "./pin-version";

/** Pin all dependencies in a pnpm workspace (including nested dependencies) */
export const pinAllDependencies = ((pkg, _context) => {
	for (const current of pinnableDependencyTypes) {
		const dependencies = pkg[current];
		if (!dependencies) continue;

		for (const [dependency, value] of Object.entries(dependencies)) {
			dependencies[dependency] = pinVersion(value);
		}
	}

	return pkg;
}) satisfies ReadPackageHook;
