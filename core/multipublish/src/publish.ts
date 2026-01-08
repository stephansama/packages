import type { Package } from "@manypkg/get-packages";

import * as cp from "node:child_process";
import * as path from "node:path";

import type { Config } from "./schema";

import { type AgentName, detectPackageManager } from "./detect";
import { jsrPlatformOptionsSchema, npmPlatformOptionsSchema } from "./schema";
import * as util from "./util";

export const jsrPublishCommand = {
	bun: "",
	deno: "deno publish",
	npm: "npx jsr publish",
	pnpm: "pnpm dlx jsr publish",
	yarn: "yarn dlx jsr publish",
} satisfies Partial<Record<AgentName, string>>;

export async function publishPlatform(
	pkg: Package & { newVersion: string; oldVersion: string },
	platform: Config["platforms"][number],
) {
	const isString = typeof platform === "string";
	const key = isString ? platform : platform[0];
	const rawConfig = isString ? {} : platform[1];

	switch (key) {
		case "jsr": {
			const config = jsrPlatformOptionsSchema.parse(rawConfig);
			const pkgRoot = path.dirname(pkg.dir);
			const jsr = await util.loadJsrConfigFile(pkgRoot);

			if (config.experimentalGenerateJSR) {
				jsr.config = await util.transformPkgJsonForJsr(pkg);
				jsr.filename = path.join(pkgRoot, util.JSR_CONFIG_FILENAME);
			}

			if (!jsr.config) throw new Error("failed to load jsr config file");
			if (!jsr.filename) {
				throw new Error("failed to load jsr config filename");
			}

			// TODO: update jsr.json file
			// TODO: update package json with actual catalog: versions

			await util.chdir(pkgRoot, async () => {
				const packageManager = await detectPackageManager();
				const command = jsrPublishCommand[packageManager];
				cp.execSync(command + " --allow-dirty --dry-run", {
					stdio: "inherit",
				});
			});

			util.gitClean(jsr.filename);
			break;
		}
		case "npm": {
			const config = npmPlatformOptionsSchema.parse(rawConfig);
			// TODO: create root .npmrc
			// TODO: update package.json with registry if not npm
			// TODO: update package.json version with next version
			// TODO: publish npm package
			// TODO: delete changed files
			break;
		}
		default:
			throw new Error(`no implementation found for ${key}`);
	}
}
