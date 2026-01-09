#!/usr/bin/env node

import { findRoot } from "@manypkg/find-root";
import { getPackages } from "@manypkg/get-packages";

import { getArgs } from "./args";
import { loadConfig } from "./config";
import { publishPlatform } from "./publish";
import * as util from "./util";

export async function run() {
	const args = await getArgs();
	const config = await loadConfig(args);
	const root = await findRoot(process.cwd());
	const { packages } = await getPackages(root.rootDir);
	const { releases } = await util.getChangesetReleases();
	const releasedPackages = releases.map((release) => {
		const packageJson = packages.find(
			(pkg) => pkg.packageJson.name === release.name,
		);

		if (!packageJson) {
			throw new Error(
				`unable to find package for released package ${release.name}`,
			);
		}

		return {
			newVersion: release.newVersion,
			oldVersion: release.oldVersion,
			...packageJson,
		};
	});

	for (const pkg of releasedPackages) {
		for (const platform of config.platforms) {
			await publishPlatform(pkg, platform);
		}
	}
}
