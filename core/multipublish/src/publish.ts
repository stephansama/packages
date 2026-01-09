import type { Package } from "@manypkg/get-packages";

import { findRoot } from "@manypkg/find-root";
import dedent from "dedent";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import type { Config } from "./schema";

import { getArgs } from "./args";
import { updatePackageJsonWithCatalog } from "./catalog";
import { type AgentName, detectPackageManager } from "./detect";
import { jsrPlatformOptionsSchema, npmPlatformOptionsSchema } from "./schema";
import * as util from "./util";

export function npmrcTemplate({
	authToken: AUTH_TOKEN,
	registry: REGISTRY,
	registryDomain: REGISTRY_DOMAIN,
	scope: SCOPE,
}: {
	authToken: string;
	registry: string;
	registryDomain: string;
	scope: string;
}) {
	return dedent`
	{{SCOPE}}:registry={{REGISTRY}}
	//{{REGISTRY_DOMAIN}}/:_authToken={{AUTH_TOKEN}}
	`
		.replace("{{AUTH_TOKEN}}", AUTH_TOKEN)
		.replace("{{REGISTRY}}", REGISTRY)
		.replace("{{REGISTRY_DOMAIN}}", REGISTRY_DOMAIN)
		.replace("{{SCOPE}}", SCOPE);
}

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
	pkg: Package & { newVersion: string; oldVersion: string },
	platform: Config["platforms"][number],
) {
	const packageManager = await detectPackageManager();
	const isString = typeof platform === "string";
	const key = isString ? platform : platform[0];
	const rawConfig = isString ? {} : platform[1];
	const args = await getArgs();
	const isDryRun = !!args.dry;

	switch (key) {
		case "jsr": {
			const config = jsrPlatformOptionsSchema.parse(rawConfig);
			const jsr = await util.loadJsrConfigFile(pkg.dir);

			if (config.experimentalGenerateJSR) {
				jsr.config = util.transformPkgJsonForJsr(pkg);
				jsr.filename = path.join(pkg.dir, util.JSR_CONFIG_FILENAME);
			}

			if (!jsr.config) throw new Error("failed to load jsr config file");
			if (!jsr.filename) {
				throw new Error("failed to load jsr config filename");
			}

			jsr.config.include ??= [];
			jsr.config.include = [
				...jsr.config.include,
				...(config.defaultInclude ? config.defaultInclude : []),
			];

			jsr.config.exclude ??= [];
			jsr.config.exclude = [
				...jsr.config.exclude,
				...(config.defaultExclude ? config.defaultExclude : []),
			];

			jsr.config.version = pkg.newVersion;
			await fsp.writeFile(jsr.filename, JSON.stringify(jsr.config));

			if (config.experimentalUpdateCatalogs) {
				if (packageManager === "pnpm" || packageManager === "bun") {
					await updatePackageJsonWithCatalog(pkg, packageManager);
				} else {
					console.error(
						`attempted to update catalogs with an unsupported package manager ${packageManager}`,
					);
				}
			}

			await util.chdir(pkg.dir, () => {
				const command = jsrPublishCommand[packageManager];
				cp.execSync(
					[
						command,
						"--allow-dirty",
						isDryRun && "--dry-run",
						config.allowSlowTypes && "--allow-slow-types",
					]
						.filter((x) => x)
						.join(" "),
					{ stdio: "inherit" },
				);
			});

			util.gitClean(jsr.filename);
			break;
		}
		case "npm": {
			const { rootDir } = await findRoot(process.cwd());
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

					const npmrcPath = path.join(rootDir, ".npmrc");
					const npmrcPrefix = fs.existsSync(npmrcPath)
						? await fsp.readFile(npmrcPath, { encoding: "utf8" })
						: "";

					const scope = pkg.packageJson.name.split("/").at(0);
					if (!scope?.startsWith("@")) {
						throw new Error("scope must start with `@` symbol");
					}

					const npmrcFile =
						npmrcPrefix +
						"\n" +
						npmrcTemplate({
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
					break;
				}
			}

			pkg.packageJson.version = pkg.newVersion;
			const file = JSON.stringify(pkg.packageJson, undefined, 2);
			const packageJsonPath = path.join(pkg.dir, "package.json");
			await fsp.writeFile(packageJsonPath, file);

			await util.chdir(pkg.dir, () => {
				const command = npmPublishCommand[packageManager];
				cp.execSync(
					[command, "--no-git-checks", isDryRun && "--dry-run"]
						.filter((x) => x)
						.join(" "),
					{ stdio: "inherit" },
				);
			});

			util.gitClean(packageJsonPath);
			if (config.strategy === ".npmrc") {
				util.gitClean(path.join(rootDir, ".npmrc"));
			}
			break;
		}
		default:
			throw new Error(`no implementation found for ${key}`);
	}
}
