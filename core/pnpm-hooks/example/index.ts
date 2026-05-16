import { readPackageHooks, type types } from "../dist/index.mjs";

export const hooks = {
	readPackage: readPackageHooks.pinAllDependencies,
} satisfies types.PnpmFileHooks;
