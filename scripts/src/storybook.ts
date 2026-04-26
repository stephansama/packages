#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as path from "node:path";

const { packages } = await getPackages(process.cwd());

const www = packages.find((pkg) => pkg.packageJson.name === "www");
if (!www) throw new Error("unable to find www package");

for (const pkg of packages) {
	if (!("storybook" in pkg.packageJson)) continue;
	if (!("url" in pkg.packageJson.storybook)) continue;
	if (typeof pkg.packageJson.storybook.url !== "string") continue;

	const storybookDir = path.resolve(path.join(pkg.dir, "storybook-static"));
	const outputDir = path.resolve(
		path.join(www.dir, "public", "api", pkg.packageJson.name, "storybook"),
	);

	await fs.promises.cp(storybookDir, outputDir, { recursive: true });

	console.info(
		`successfully copied ${pkg.packageJson.name} storybook configuration to documentation site`,
	);
}
