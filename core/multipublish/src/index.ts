import { findRoot } from "@manypkg/find-root";
import { getPackages } from "@manypkg/get-packages";

import { getArguments } from "./arguments";
import { loadConfig } from "./config";
import { updateJsrConfigVersion } from "./jsr";
import { publishPlatform } from "./publish";
import { loadReleases } from "./release";

/** Thrown by {@link run} after every platform was attempted, if any failed */
export class PublishError extends Error {
	constructor(readonly failures: string[]) {
		super(
			`${failures.length} publish${failures.length === 1 ? "" : "es"} failed: ${failures.join(", ")}`,
		);
		this.name = "PublishError";
	}
}

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

	const failures: string[] = [];

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

		// keep publishing the other platforms and packages when one fails, so a
		// registry outage doesn't block the rest, then fail the run at the end
		for (const platform of config.platforms) {
			try {
				await publishPlatform(pkg, platform);
			} catch (error) {
				const name =
					typeof platform === "string" ? platform : platform[0];
				const message =
					error instanceof Error ? error.message : String(error);
				console.error(
					`✖ ${pkg.packageJson.name} (${name}): ${message}`,
				);
				failures.push(`${pkg.packageJson.name} (${name})`);
			}
		}
	}

	if (failures.length > 0) {
		throw new PublishError(failures);
	}
}
