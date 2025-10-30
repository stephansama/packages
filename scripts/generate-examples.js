#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as path from "node:path";

const { packages } = await getPackages(process.cwd());

const outputDir = path.join(path.dirname(import.meta.filename), "dist");

fs.mkdirSync(outputDir, { recursive: true });

const examples = packages
	.filter((pkg) => {
		if (pkg.packageJson.relativeDir.startsWith("examples")) {
			const isNamedProperly = pkg.packageJson.name.includes("@example");
			if (!isNamedProperly) throw new Error("");
			return true;
		}

		return false;
	})
	.map((pkg) => ({
		description: pkg.packageJson.description,
		dir: pkg.dir,
		name: pkg.packageJson.name,
		relativeDir: pkg.relativeDir,
		version: pkg.packageJson.version,
	}));

fs.writeFileSync(
	path.join(outputDir, "examples.json"),
	JSON.stringify(examples, undefined, 2),
);
