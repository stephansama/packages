import * as fs from "node:fs";
import * as os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { findingsFromManifest, scan, ScanError } from "./scan";

let root: string;

function link(target: string, from: string) {
	const source = path.join(root, from);
	fs.mkdirSync(path.dirname(source), { recursive: true });
	fs.symlinkSync(
		path.relative(path.dirname(source), path.join(root, target)),
		source,
	);
}

function write(file: string, data: unknown) {
	const target = path.join(root, file);
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, JSON.stringify(data));
}

beforeAll(() => {
	root = fs.mkdtempSync(path.join(os.tmpdir(), "find-floating-deps-"));

	write("package.json", {
		dependencies: { "@types/ws": "8.18.1", "left-pad": "^1.3.0" },
		devDependencies: { vitest: "*" },
		name: "fixture-root",
		version: "1.0.0",
	});

	const store = "node_modules/.pnpm";
	write(`${store}/@types+ws@8.18.1/node_modules/@types/ws/package.json`, {
		dependencies: { "@types/node": "*" },
		name: "@types/ws",
		version: "8.18.1",
	});
	link(
		`${store}/@types+node@24.12.2/node_modules/@types/node`,
		`${store}/@types+ws@8.18.1/node_modules/@types/node`,
	);
	write(
		`${store}/@types+node@24.12.2/node_modules/@types/node/package.json`,
		{
			dependencies: { "undici-types": "~7.10.0" },
			name: "@types/node",
			version: "24.12.2",
		},
	);
	write(`${store}/left-pad@1.3.0/node_modules/left-pad/package.json`, {
		name: "left-pad",
		peerDependencies: { react: ">=18" },
		version: "1.3.0",
	});
	link(
		`${store}/left-pad@1.3.0/node_modules/left-pad`,
		"node_modules/left-pad",
	);
});

afterAll(() => {
	fs.rmSync(root, { force: true, recursive: true });
});

describe("scan", () => {
	it("finds floating ranges in the workspace and the pnpm store", async () => {
		const findings = await scan({ cwd: root, depTypes: ["dependencies"] });

		expect(findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					dependency: "left-pad",
					kind: "caret",
					parent: "fixture-root",
					pinnable: true,
					resolved: "1.3.0",
				}),
				expect.objectContaining({
					dependency: "@types/node",
					kind: "wildcard",
					parent: "@types/ws",
					parentVersion: "8.18.1",
					pinnable: false,
					resolved: "24.12.2",
				}),
				expect.objectContaining({
					dependency: "undici-types",
					kind: "tilde",
					parent: "@types/node",
					resolved: undefined,
				}),
			]),
		);
		expect(findings).toHaveLength(3);
	});

	it("only checks the requested dependency types", async () => {
		const findings = await scan({
			cwd: root,
			depTypes: ["peerDependencies", "devDependencies"],
		});

		expect(
			findings.map(
				({ dependency, depType }) => `${depType}:${dependency}`,
			),
		).toEqual(["devDependencies:vitest", "peerDependencies:react"]);
	});

	it("skips third-party packages with workspaceOnly", async () => {
		const findings = await scan({
			cwd: root,
			depTypes: ["dependencies"],
			workspaceOnly: true,
		});

		expect(findings.map((finding) => finding.dependency)).toEqual([
			"left-pad",
		]);
	});

	it("fails without a pnpm virtual store", async () => {
		const empty = fs.mkdtempSync(
			path.join(os.tmpdir(), "find-floating-deps-"),
		);
		fs.writeFileSync(path.join(empty, "package.json"), '{"name":"empty"}');

		await expect(
			scan({ cwd: empty, depTypes: ["dependencies"] }),
		).rejects.toThrow(ScanError);

		fs.rmSync(empty, { force: true, recursive: true });
	});
});

describe("findingsFromManifest", () => {
	it("marks peer dependencies as not pinnable", () => {
		const [finding] = findingsFromManifest(
			{ name: "a", peerDependencies: { b: "^1.0.0" }, version: "1.0.0" },
			["peerDependencies"],
		);

		expect(finding?.pinnable).toBe(false);
	});

	it("marks ranges without an exact lower bound as not pinnable", () => {
		const findings = findingsFromManifest(
			{
				dependencies: {
					a: "^1.2.3",
					b: "1.x",
					c: ">1.0.0",
					d: "~1.2.3",
				},
				name: "root",
			},
			["dependencies"],
		);

		expect(
			Object.fromEntries(findings.map((f) => [f.dependency, f.pinnable])),
		).toEqual({ a: true, b: false, c: false, d: true });
	});
});

describe("catalogs", () => {
	const catalogs = {
		cli: { picocolors: "^1.1.1" },
		default: { typescript: "5.9.3", vite: "~6.3.5" },
	};

	it("classifies catalog: specs by the catalog's range", () => {
		const findings = findingsFromManifest(
			{
				dependencies: {
					picocolors: "catalog:cli",
					typescript: "catalog:",
					vite: "catalog:default",
				},
				name: "pkg",
			},
			["dependencies"],
			{ catalogs },
		);

		expect(findings).toEqual([
			expect.objectContaining({
				catalog: "cli",
				dependency: "picocolors",
				kind: "caret",
				pinnable: false,
				spec: "^1.1.1",
			}),
			expect.objectContaining({
				catalog: "default",
				dependency: "vite",
				kind: "tilde",
				pinnable: false,
				spec: "~6.3.5",
			}),
		]);
	});

	it("skips catalog: specs whose entry is missing", () => {
		const findings = findingsFromManifest(
			{ dependencies: { react: "catalog:cli" }, name: "pkg" },
			["dependencies"],
			{ catalogs },
		);

		expect(findings).toEqual([]);
	});

	it("reads catalogs from pnpm-workspace.yaml in a scan", async () => {
		fs.writeFileSync(
			path.join(root, "pnpm-workspace.yaml"),
			"catalog:\n  left-pad: ^1.3.0\ncatalogs:\n  test:\n    vitest: '>=4'\n",
		);
		write("package.json", {
			dependencies: { "left-pad": "catalog:" },
			devDependencies: { vitest: "catalog:test" },
			name: "fixture-root",
			version: "1.0.0",
		});

		const findings = await scan({
			cwd: root,
			depTypes: ["dependencies", "devDependencies"],
			workspaceOnly: true,
		});

		expect(
			findings.map(({ catalog, dependency, kind, spec }) => ({
				catalog,
				dependency,
				kind,
				spec,
			})),
		).toEqual([
			{
				catalog: "default",
				dependency: "left-pad",
				kind: "caret",
				spec: "^1.3.0",
			},
			{
				catalog: "test",
				dependency: "vitest",
				kind: "comparison",
				spec: ">=4",
			},
		]);
	});
});
