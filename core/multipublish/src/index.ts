#!/usr/bin/env node

import { findRoot } from "@manypkg/find-root";
import { getPackages } from "@manypkg/get-packages";

import { getArgs } from "./args";
import { loadConfig } from "./config";
import { updateJsrConfigVersion } from "./jsr";
import { publishPlatform } from "./publish";
import { loadReleases } from "./release";

export async function run() {
	const root = await findRoot(process.cwd());
	const args = await getArgs();
	const config = await loadConfig(args);
	const { packages } = await getPackages(root.rootDir);
	const releases = await loadReleases(args);
	const releasedPackages = releases.map((release) => {
		const pkg = packages.find(
			(curr) => curr.packageJson.name === release.name,
		);

		if (!pkg) {
			throw new Error(
				`unable to find package for released package ${release.name}`,
			);
		}

		return { ...pkg, version: release.version };
	});

	for (const pkg of releasedPackages) {
		if (args.versionJsr) {
			await updateJsrConfigVersion(pkg);
			continue;
		}

		for (const platform of config.platforms) {
			await publishPlatform(pkg, platform);
		}
	}
}
