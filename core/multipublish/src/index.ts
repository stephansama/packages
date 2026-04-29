import { findRoot } from "@manypkg/find-root";
import { getPackages } from "@manypkg/get-packages";

import { getArguments } from "./arguments";
import { loadConfig } from "./config";
import { updateJsrConfigVersion } from "./jsr";
import { publishPlatform } from "./publish";
import { loadReleases } from "./release";

export async function run() {
	const root = await findRoot(process.cwd());
	const arguments_ = await getArguments();
	const config = await loadConfig(arguments_);
	const { packages } = await getPackages(root.rootDir);
	const releases = await loadReleases(arguments_);
	const releasedPackages = releases.map((release) => {
		const pkg = packages.find(
			(current) => current.packageJson.name === release.name,
		);

		if (!pkg) {
			throw new Error(
				`unable to find package for released package ${release.name}`,
			);
		}

		return { ...pkg, version: release.version || pkg.packageJson.version };
	});

	for (const pkg of releasedPackages) {
		if (arguments_.versionJsr) {
			if (!pkg.packageJson.name.includes("/")) {
				console.warn(
					`attempting to publish a non scoped package skipping`,
				);
				continue;
			}

			await updateJsrConfigVersion(pkg);

			continue;
		}

		for (const platform of config.platforms) {
			await publishPlatform(pkg, platform);
		}
	}
}
