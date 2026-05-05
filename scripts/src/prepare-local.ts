#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as cp from "node:child_process";
import * as fs from "node:fs";

if (process.env.CI) process.exit(0);

const sh = String.raw;

const { packages, rootPackage } = await getPackages(process.cwd());

const allRootDependencies = {
	...rootPackage?.packageJson.devDependencies,
	...rootPackage?.packageJson.dependencies,
};

const stephansamaPackageNames = new Set(
	Object.keys(allRootDependencies).filter((dependency) => {
		return dependency.startsWith("@stephansama/");
	}),
);

const stephansamaPackages = packages.filter((pkg) => {
	return stephansamaPackageNames.has(pkg.packageJson.name);
});

for (const pkg of stephansamaPackages) {
	const hasAllOutputs = pkg.packageJson.files.every((file) => {
		return fs.existsSync(file);
	});

	if (hasAllOutputs) continue;

	cp.execSync(sh`pnpm --filter='${pkg.packageJson.name}' run build`);
}
