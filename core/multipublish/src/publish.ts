import type { Package } from "@manypkg/get-packages";

import { findRoot } from "@manypkg/find-root";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";

import type { Config } from "./schema";

import { getArguments } from "./arguments";
import { updatePackageJsonWithCatalog } from "./catalog";
import { type AgentName, detectPackageManager } from "./detect";
import * as jsr from "./jsr";
import { jsrPlatformOptionsSchema, npmPlatformOptionsSchema } from "./schema";
import * as utilities from "./utilities";

export const npmPublishCommand = {
	bun: "bun publish",
	npm: "npm publish",
	pnpm: "pnpm publish",
	yarn: "yarn publish",
} satisfies Record<Exclude<AgentName, "deno">, string>;

export const jsrPublishCommand = {
	bun: "bunx publish",
	deno: "deno publish",
	npm: "npx jsr publish",
	pnpm: "pnpm dlx jsr publish",
	yarn: "yarn dlx jsr publish",
} satisfies Record<AgentName, string>;

export async function publishPlatform(
	pkg: Package,
	platform: Config["platforms"][number],
) {
	const packageManager = await detectPackageManager();
	const isString = typeof platform === "string";
	const key = isString ? platform : platform[0];
	const rawConfig = isString ? {} : platform[1];
	const arguments_ = await getArguments();
	const isDryRun = !!arguments_.dry;
	const packageJsonPath = path.join(pkg.dir, "package.json");

	switch (key + "") {
		case "jsr": {
			const config = jsrPlatformOptionsSchema.parse(rawConfig);
			const userJsr = await jsr.loadConfig(pkg.dir);

			if (config.experimentalGenerateJSR) {
				userJsr.config = jsr.transformer.parse(pkg.packageJson);
				userJsr.filename = path.join(
					pkg.dir,
					utilities.JSR_CONFIG_FILENAME,
				);
			}

			if (!userJsr.config) {
				throw new Error("failed to load userJsr config file");
			}

			if (!userJsr.filename) {
				throw new Error("failed to load userJsr config filename");
			}

			jsr.updateIncludeExcludeList(userJsr.config, config);
			jsr.includeExportDirectories(userJsr.config);

			const jsrFile = JSON.stringify(userJsr.config, undefined, 2);
			await fsp.writeFile(userJsr.filename, jsrFile);

			if (config.experimentalUpdateCatalogs) {
				if (packageManager === "pnpm" || packageManager === "bun") {
					await updatePackageJsonWithCatalog(pkg, packageManager);
				} else {
					console.error(
						`attempted to update catalogs with an unsupported package manager ${packageManager}`,
					);
				}
			}

			const authToken = process.env[config.tokenEnvironmentKey];
			const jsrFilename = userJsr.filename;

			try {
				await utilities.chdir(pkg.dir, () => {
					execPublish(pkg, "jsr", [
						jsrPublishCommand[packageManager],
						"--allow-dirty",
						config.allowSlowTypes && "--allow-slow-types",
						isDryRun && "--dry-run",
						authToken && `--token ${authToken}`,
					]);
				});
			} finally {
				utilities.gitClean(jsrFilename);
				if (config.experimentalUpdateCatalogs) {
					utilities.gitClean(packageJsonPath);
				}
			}

			break;
		}
		case "npm": {
			const { rootDir } = await findRoot(process.cwd());
			const npmrcPath = path.join(rootDir, ".npmrc");
			const config = npmPlatformOptionsSchema.parse(rawConfig);

			if (packageManager === "deno") {
				throw new Error("deno is not supported for npm publish");
			}

			switch (config.strategy) {
				case ".npmrc": {
					const authToken = process.env[config.tokenEnvironmentKey];
					if (!authToken) {
						throw new Error(
							"no auth token provided. please use an auth token with npmrc strategy",
						);
					}

					const npmrcPrefix = fs.existsSync(npmrcPath)
						? await fsp.readFile(npmrcPath, "utf8")
						: "";

					const scope = pkg.packageJson.name.split("/").at(0);
					if (!scope?.startsWith("@")) {
						throw new Error(
							`${pkg.packageJson.name} is not scoped, the .npmrc strategy needs an @scope`,
						);
					}

					const npmrcFile =
						npmrcPrefix +
						"\n" +
						utilities.npmrcTemplate({
							authToken,
							registry: config.registry,
							registryDomain: new URL(config.registry).host,
							scope,
						});

					await fsp.writeFile(npmrcPath, npmrcFile);
					break;
				}
				case "package.json": {
					pkg.packageJson.publishConfig ??= {};
					pkg.packageJson.publishConfig.registry = config.registry;
					const file = JSON.stringify(pkg.packageJson, undefined, 2);
					await fsp.writeFile(packageJsonPath, file);
					break;
				}
			}

			try {
				await utilities.chdir(pkg.dir, () => {
					execPublish(pkg, "npm", [
						npmPublishCommand[packageManager],
						packageManager === "pnpm" && "--no-git-checks",
						isDryRun && "--dry-run",
					]);
				});
			} finally {
				utilities.gitClean(packageJsonPath);
				if (config.strategy === ".npmrc") utilities.gitClean(npmrcPath);
			}
			break;
		}
		default: {
			throw new Error(
				`no implementation found for ${key || "default key"}`,
			);
		}
	}
}

/**
 * Run a publish command with inherited stdio, so its output is already shown.
 * The error `execSync` throws on failure repeats the whole command, auth token
 * included, so throw one that names the package and exit code instead.
 */
function execPublish(
	pkg: Package,
	platform: string,
	parts: Array<false | string | undefined>,
) {
	const command = parts.filter((part): part is string => !!part).join(" ");

	try {
		cp.execSync(command, { stdio: "inherit" });
	} catch (error) {
		const status =
			error &&
			typeof error === "object" &&
			"status" in error &&
			typeof error.status === "number"
				? ` (exit code ${error.status})`
				: "";

		// eslint-disable-next-line preserve-caught-error -- the caught error's message repeats the command, auth token included
		throw new Error(
			`${platform} publish failed for ${pkg.packageJson.name}${status}`,
		);
	}
}
