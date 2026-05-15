#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";

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

const packageBins = new Array<string>();

for (const pkg of stephansamaPackages) {
	const hasAllOutputs = pkg.packageJson.files.every((file) => {
		return fs.existsSync(path.resolve(pkg.dir, file));
	});

	if (hasAllOutputs) continue;

	console.info(`running build for ${pkg.packageJson.name}`);

	if (pkg.packageJson.bin) {
		const { bin } = pkg.packageJson;
		const binName = pkg.packageJson.name.replace("@stephansama/", "");
		const entries = typeof bin === "string" ? [binName] : Object.keys(bin);
		packageBins.push(...entries);
	}

	const buildPackageCommand = sh`pnpm --filter='${pkg.packageJson.name}' run build`;

	cp.execSync(buildPackageCommand, { encoding: "utf8", stdio: "inherit" });
}

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const nodeBinDirectory = path.resolve(dirname, "../../node_modules/.bin/");
const nodeBins = await fs.promises.readdir(nodeBinDirectory);

if (packageBins.some((bin) => !nodeBins.includes(bin))) {
	cp.execSync(sh`pnpm install`, { stdio: "inherit" });
}
