#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";

if (process.env.CI) process.exit(0);

const sh = String.raw;

const { packages, rootPackage } = await getPackages(process.cwd());

const stephansamaPackageNames = new Set(
	Object.keys({
		...rootPackage?.packageJson.devDependencies,
		...rootPackage?.packageJson.dependencies,
	}).filter((dependency) => dependency.startsWith("@stephansama/")),
);

const stephansamaPackages = packages.filter((pkg) => {
	return stephansamaPackageNames.has(pkg.packageJson.name);
});

for (const pkg of stephansamaPackages) {
	const hasAllOutputs = pkg.packageJson.files.every((file) => {
		return fs.existsSync(path.resolve(pkg.dir, file));
	});

	if (hasAllOutputs) continue;

	console.info(`running build for ${pkg.packageJson.name}`);

	const buildPackageCommand = sh`pnpm --filter='${pkg.packageJson.name}' run build`;

	cp.execSync(buildPackageCommand, { encoding: "utf8", stdio: "inherit" });
}

cp.execSync(sh`pnpm rebuild`);
