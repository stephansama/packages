import type { Package } from "@manypkg/get-packages";

import { findRoot } from "@manypkg/find-root";
import dedent from "dedent";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import type { Config } from "./schema";

import { getArgs } from "./args";
import { type AgentName, detectPackageManager } from "./detect";
import { jsrPlatformOptionsSchema, npmPlatformOptionsSchema } from "./schema";
import * as util from "./util";

export const npmrcTemplate = dedent`
{{SCOPE}}:registry={{REGISTRY}}
//{{REGISTRY_DOMAIN}}/:_authToken={{AUTH_TOKEN}}
`;

export const npmPublishCommand = {
	bun: "",
	deno: "",
	npm: "npm publish",
	pnpm: "pnpm publish",
	yarn: "yarn publish",
} satisfies Record<AgentName, string>;

export const jsrPublishCommand = {
	bun: "",
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

			jsr.config.version = pkg.newVersion;
			await fsp.writeFile(jsr.filename, JSON.stringify(jsr.config));

			// TODO: update package json with actual catalog: versions

			await util.chdir(pkg.dir, () => {
				const command = jsrPublishCommand[packageManager];
				cp.execSync(
					[command, "--allow-dirty", isDryRun && "--dry-run"]
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

			switch (config.strategy) {
				case ".npmrc": {
					const authToken = process.env[config.tokenEnvironmentKey];
					if (!authToken) {
						throw new Error(
							"no auth token provided. please use an auth token with npmrc strategy",
						);
					}

					const npmrcFile = path.join(rootDir, ".npmrc");
					let existingNpmrcFile = fs.existsSync(npmrcFile)
						? await fsp.readFile(npmrcFile, { encoding: "utf8" })
						: "";

					const scope = pkg.packageJson.name.split("/").at(0);
					if (!scope?.startsWith("@")) {
						throw new Error("scope must start with `@` symbol");
					}

					const { host } = new URL(config.registry);

					existingNpmrcFile += npmrcTemplate
						.replace("{{AUTH_TOKEN}}", authToken)
						.replace("{{REGISTRY}}", config.registry)
						.replace("{{REGISTRY_DOMAIN}}", host)
						.replace("{{SCOPE}}", scope);

					await fsp.writeFile(npmrcFile, existingNpmrcFile);
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
					[command, isDryRun && "--dry-run"]
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
