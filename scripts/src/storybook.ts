#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import path from "node:path";

const { packages } = await getPackages(process.cwd());

const www = packages.find((pkg) => pkg.packageJson.name === "www");
if (!www) {
	throw new Error(`unable to find www package`);
}

for (const pkg of packages) {
	if (typeof pkg.packageJson.storybook?.url !== "string") continue;

	const storybookDirectory = path.resolve(
		path.join(pkg.dir, "storybook-static"),
	);

	const outputDirectory = path.resolve(
		path.join(www.dir, "public", "api", pkg.packageJson.name, "storybook"),
	);

	await fs.promises.cp(storybookDirectory, outputDirectory, {
		recursive: true,
	});

	console.info(
		`successfully copied ${pkg.packageJson.name} storybook configuration to documentation site`,
	);
}
