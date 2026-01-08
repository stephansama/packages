import type { Package } from "@manypkg/get-packages";

import fg from "fast-glob";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import { type JsrSchema, jsrTransformer } from "./jsr";

export type Changeset = {
	changesets: {
		id: string;
		releases: { name: string; type: string }[];
		summary: string;
	}[];
	releases: {
		changesets: string[];
		name: string;
		newVersion: string;
		oldVersion: string;
		type: "major" | "minor" | "patch";
	}[];
};

export const MODULE_NAME = "multipublish" as const;
export const JSR_CONFIG_FILENAME = "jsr.json" as const;

export async function chdir(
	newDir: string,
	callback: () => Promise<void> | void,
) {
	const cwd = process.cwd();
	process.chdir(newDir);
	await callback();
	process.chdir(cwd);
}

export async function getChangesetReleases(): Promise<Changeset> {
	const tmpFile = await getTmpFile("changeset.json");
	cp.execSync(`changeset status --output=${tmpFile}`, { stdio: "inherit" });
	const file = await fsp.readFile(tmpFile, { encoding: "utf8" });
	await fsp.rm(tmpFile, { recursive: true });
	return JSON.parse(file);
}

export async function getTmpFile(filename: string) {
	const tmpDir = ".publish";
	await fsp.mkdir(tmpDir, { recursive: true });
	return path.join(tmpDir, filename);
}

export function gitClean(filename: string) {
	cp.execFileSync("git", ["clean", "-f", "--", filename], {
		stdio: "inherit",
	});
}

export async function loadJsrConfigFile(
	basePath: string,
): Promise<{ config: JsrSchema | null; filename?: string }> {
	const files = await fg(basePath + "/{deno,jsr}.json{,c}");
	if (files.length > 1) {
		throw new Error("please only have one deno or jsr configuration file");
	}

	const configFile = files.at(0);
	if (!configFile) {
		console.info("no jsr config file found");
		return { config: null, filename: configFile };
	}

	const file = await fsp.readFile(configFile, { encoding: "utf8" });
	return { config: JSON.parse(file), filename: configFile };
}

export function transformPkgJsonForJsr(pkg: Package): JsrSchema {
	return jsrTransformer.parse(pkg.packageJson);
}
