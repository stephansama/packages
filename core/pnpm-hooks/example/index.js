import { readPackageHooks } from "../dist/index.mjs";

/** @type {import("../dist/index.mjs").types.PnpmFileHooks} */
export const hooks = {
	readPackage: readPackageHooks.pinAllDependencies,
};
