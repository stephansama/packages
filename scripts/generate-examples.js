#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

/**
 * @param {Object} param0
 * @param {boolean} [param0.writeToFile=true]
 */
export async function generate({ writeToFile = true } = {}) {
	const { packages } = await getPackages(process.cwd());
	const outputDir = path.join(path.dirname(import.meta.filename), "dist");

	fs.mkdirSync(outputDir, { recursive: true });

	const examples = packages
		.filter((pkg) => {
			if (pkg.relativeDir.startsWith("examples")) {
				const isNamedProperly =
					pkg.packageJson.name.includes("@example");
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

	if (writeToFile) {
		fs.writeFileSync(
			path.join(outputDir, "examples.js"),
			`export default ${JSON.stringify(examples, undefined, 2)}`,
		);
	}

	return examples;
}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) generate();
