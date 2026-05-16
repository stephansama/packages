import { remark } from "remark";
import { afterEach, expect, it, vi } from "vitest";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { autoReadmeRemarkPlugin } from "./plugin";
import { defaultTableHeadings, defaultTemplates } from "./schema";

const mocks = vi.hoisted(() => ({
	getContrastText: vi.fn().mockReturnValue("ffffff"),
	getSimpleIconColor: vi.fn().mockReturnValue(["61DAFB", "react"]),
	resolveVersion: vi.fn().mockImplementation(({ version }: { version: string }) => version),
}));

vi.mock("./color", () => ({ getContrastText: mocks.getContrastText }));
vi.mock("./icon", () => ({ getSimpleIconColor: mocks.getSimpleIconColor }));
vi.mock("./log", () => ({ INFO: vi.fn() }));
vi.mock("./utilities", () => ({ resolveVersion: mocks.resolveVersion }));

afterEach(vi.clearAllMocks);

const defaultConfig: Config = {
	badgeOptions: { dependencyTypes: ["dependencies", "devDependencies"], templates: [] },
	disableEmojis: false,
	headings: defaultTableHeadings,
	onlyShowPublicPackages: false,
	removeScope: "",
	templates: defaultTemplates,
};

async function processMarkdown(
	md: string,
	config: Config = defaultConfig,
	data: ActionData = [],
) {
	return (
		await remark()
			.use(autoReadmeRemarkPlugin, config, data)
			.process(md)
	).toString();
}

function withZone(name: string) {
	return `<!-- ${name} start -->\n\n<!-- ${name} end -->`;
}

// BADGE zone

it("BADGE: generates shield badge for dependency with known icon color", async () => {
	mocks.getSimpleIconColor.mockReturnValue(["61DAFB", "react"]);
	mocks.getContrastText.mockReturnValue("000000");

	const data = [
		{
			action: "BADGE",
			catalogs: undefined,
			parameters: [],
			pkgJson: { dependencies: { react: "^18.0.0" }, devDependencies: {}, name: "my-package", version: "1.0.0" },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("BADGE"), defaultConfig, data);

	expect(result).toContain("img.shields.io/badge");
	expect(result).toContain("61DAFB");
	expect(result).toContain("react");
});

it("BADGE: skips badge when getSimpleIconColor returns no color", async () => {
	mocks.getSimpleIconColor.mockReturnValue([undefined, "unknownslug"]);

	const data = [
		{
			action: "BADGE",
			catalogs: undefined,
			parameters: [],
			pkgJson: { dependencies: { "unknown-lib": "^1.0.0" }, devDependencies: {}, name: "my-package", version: "1.0.0" },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("BADGE"), defaultConfig, data);

	expect(result).not.toContain("img.shields.io/badge");
});

it("BADGE: includes template badges when configured", async () => {
	const config: Config = {
		...defaultConfig,
		badgeOptions: {
			dependencyTypes: ["dependencies"],
			templates: [
				{
					image: "https://img.shields.io/npm/v/{{name}}",
					label: "npm",
					url: "https://npmjs.com/package/{{name}}",
				},
			],
		},
	};

	const data = [
		{
			action: "BADGE",
			catalogs: undefined,
			parameters: [],
			pkgJson: { dependencies: {}, devDependencies: {}, name: "my-package", version: "1.0.0" },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("BADGE"), config, data);

	expect(result).toContain("npmjs.com/package/my-package");
	expect(result).toContain("npm");
});

it("BADGE: skips template badges when --skip-templates is present", async () => {
	const config: Config = {
		...defaultConfig,
		badgeOptions: {
			dependencyTypes: ["dependencies"],
			templates: [
				{
					image: "https://img.shields.io/npm/v/{{name}}",
					label: "npm",
					url: "https://npmjs.com/package/{{name}}",
				},
			],
		},
	};

	const data = [
		{
			action: "BADGE",
			catalogs: undefined,
			parameters: ["--skip-templates"],
			pkgJson: { dependencies: {}, devDependencies: {}, name: "my-package", version: "1.0.0" },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("BADGE"), config, data);

	expect(result).not.toContain("npmjs.com/package");
});

// ACTION zone

it("ACTION: generates markdown table for TABLE format", async () => {
	const data = [
		{
			action: "ACTION",
			actionYaml: {
				inputs: {
					"dry-run": { default: "false", description: "Skip changes", required: false },
					token: { default: "github_token", description: "GitHub token", required: true },
				},
			},
			parameters: [],
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("ACTION"), defaultConfig, data);

	expect(result).toContain("token");
	expect(result).toContain("dry-run");
	expect(result).toMatch(/\|.*\|/);
});

it("ACTION: generates list for LIST format", async () => {
	const data = [
		{
			action: "ACTION",
			actionYaml: {
				inputs: {
					token: { default: "github_token", description: "GitHub token", required: true },
				},
			},
			parameters: [],
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		"<!-- ACTION-LIST start -->\n\n<!-- ACTION-LIST end -->",
		defaultConfig,
		data,
	);

	expect(result).toContain("- ");
	expect(result).toContain("token");
	expect(result).not.toMatch(/\|.*\|/);
});

// PKG zone

it("PKG: generates table with dependencies and devDependencies", async () => {
	const data = [
		{
			action: "PKG",
			catalogs: undefined,
			parameters: [],
			pkgJson: {
				dependencies: { react: "^18.0.0" },
				devDependencies: { typescript: "^5.0.0" },
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("PKG"), defaultConfig, data);

	expect(result).toContain("react");
	expect(result).toContain("typescript");
	expect(result).toMatch(/\|.*\|/);
});

it("PKG: returns empty content for LIST format", async () => {
	const data = [
		{
			action: "PKG",
			catalogs: undefined,
			parameters: [],
			pkgJson: { dependencies: { react: "^18.0.0" }, devDependencies: {} },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		"<!-- PKG-LIST start -->\n\n<!-- PKG-LIST end -->",
		defaultConfig,
		data,
	);

	expect(result.trim()).not.toContain("|");
});

it("PKG: renders workspace: version as inline code", async () => {
	const data = [
		{
			action: "PKG",
			catalogs: undefined,
			parameters: [],
			pkgJson: {
				dependencies: { react: "workspace:*" },
				devDependencies: {},
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("PKG"), defaultConfig, data);

	expect(result).toContain("`workspace:*`");
});

// WORKSPACE zone

it("WORKSPACE: generates table with package names", async () => {
	const data = [
		{
			action: "WORKSPACE",
			isPnpm: false,
			parameters: [],
			root: "/root",
			workspaces: {
				packages: [
					{
						dir: "/root/packages/my-pkg",
						packageJson: { description: "A test package", name: "@scope/my-pkg", version: "1.0.0" },
					},
				],
				root: { dir: "/root", packageJson: {} },
				rootPackageJson: {},
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("WORKSPACE"), defaultConfig, data);

	expect(result).toContain("my-pkg");
	expect(result).toMatch(/\|.*\|/);
});

it("WORKSPACE: excludes private packages when onlyShowPublicPackages is true", async () => {
	const config: Config = { ...defaultConfig, onlyShowPublicPackages: true };

	const data = [
		{
			action: "WORKSPACE",
			isPnpm: false,
			parameters: [],
			root: "/root",
			workspaces: {
				packages: [
					{
						dir: "/root/packages/public-pkg",
						packageJson: { name: "public-pkg", version: "1.0.0" },
					},
					{
						dir: "/root/packages/private-pkg",
						packageJson: { name: "private-pkg", private: true, version: "1.0.0" },
					},
				],
				root: { dir: "/root", packageJson: {} },
				rootPackageJson: {},
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("WORKSPACE"), config, data);

	expect(result).toContain("public-pkg");
	expect(result).not.toContain("private-pkg");
});

// ZOD zone

it("ZOD: inserts pre-rendered markdown body into zone", async () => {
	const data = [
		{
			action: "ZOD",
			body: "| Name | Type |\n| --- | --- |\n| field | string |",
			parameters: [],
		},
	] as unknown as ActionData;

	const result = await processMarkdown(withZone("ZOD"), defaultConfig, data);

	expect(result).toContain("Name");
	expect(result).toContain("field");
});

it("ZOD: throws when body is missing", async () => {
	const data = [
		{
			action: "ZOD",
			body: undefined,
			parameters: [],
		},
	] as unknown as ActionData;

	await expect(
		processMarkdown(withZone("ZOD"), defaultConfig, data),
	).rejects.toThrow("unable to load zod body");
});
