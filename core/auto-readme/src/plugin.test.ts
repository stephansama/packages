/* eslint-disable e18e/prefer-static-regex */
import { remark } from "remark";
import { afterEach, expect, it, vi } from "vitest";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { autoReadmeRemarkPlugin } from "./plugin";
import { defaultTableHeadings, defaultTemplates } from "./schema";

const mocks = vi.hoisted(() => ({
	getContrastText: vi.fn().mockReturnValue("ffffff"),
	getSimpleIconColor: vi.fn().mockReturnValue(["61DAFB", "react"]),
	resolveVersion: vi
		.fn()
		.mockImplementation(({ version }: { version: string }) => version),
}));

vi.mock("./color", () => ({ getContrastText: mocks.getContrastText }));
vi.mock("./icon", () => ({ getSimpleIconColor: mocks.getSimpleIconColor }));
vi.mock("./log", () => ({ INFO: vi.fn() }));
vi.mock("./utilities", () => ({ resolveVersion: mocks.resolveVersion }));

afterEach(vi.clearAllMocks);

const defaultConfig: Config = {
	badgeOptions: {
		dependencyTypes: ["dependencies", "devDependencies"],
		templates: [],
	},
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
	const result = await remark()
		.use(autoReadmeRemarkPlugin, config, data)
		.process(md);
	return result.toString();
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
			pkgJson: {
				dependencies: { react: "^18.0.0" },
				devDependencies: {},
				name: "my-package",
				version: "1.0.0",
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("BADGE"),
		defaultConfig,
		data,
	);

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
			pkgJson: {
				dependencies: { "unknown-lib": "^1.0.0" },
				devDependencies: {},
				name: "my-package",
				version: "1.0.0",
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("BADGE"),
		defaultConfig,
		data,
	);

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
			pkgJson: {
				dependencies: {},
				devDependencies: {},
				name: "my-package",
				version: "1.0.0",
			},
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
			pkgJson: {
				dependencies: {},
				devDependencies: {},
				name: "my-package",
				version: "1.0.0",
			},
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
					"dry-run": {
						default: "false",
						description: "Skip changes",
						required: false,
					},
					"token": {
						default: "github_token",
						description: "GitHub token",
						required: true,
					},
				},
			},
			parameters: [],
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("ACTION"),
		defaultConfig,
		data,
	);

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
					token: {
						default: "github_token",
						description: "GitHub token",
						required: true,
					},
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
			pkgJson: {
				dependencies: { react: "^18.0.0" },
				devDependencies: {},
			},
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
						packageJson: {
							description: "A test package",
							name: "@scope/my-pkg",
							version: "1.0.0",
						},
					},
				],
				root: { dir: "/root", packageJson: {} },
				rootPackageJson: {},
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("WORKSPACE"),
		defaultConfig,
		data,
	);

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
						packageJson: {
							name: "private-pkg",
							private: true,
							version: "1.0.0",
						},
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

// BADGE zone: auto discovered .mcp.json / skills-lock.json

const badgeWithExtras = [
	{
		action: "BADGE",
		catalogs: undefined,
		mcp: {
			mcpServers: {
				"karakeep": {
					args: ["dlx", "@karakeep/mcp@0.33.1"],
					command: "pnpm",
				},
				"n8n-mcp": {
					headers: { Authorization: "Bearer ${N8N_MCP_TOKEN}" },
					type: "http",
					url: "https://n8n.example.com/mcp-server/http",
				},
			},
		},
		parameters: [],
		pkgJson: {
			dependencies: {},
			devDependencies: {},
			name: "my-package",
			version: "1.0.0",
		},
		skills: {
			skills: {
				"ab-testing": {
					computedHash: "abc",
					skillPath: "skills/ab-testing/SKILL.md",
					source: "coreyhaines31/marketingskills",
					sourceType: "github",
				},
				"local-skill": {
					computedHash: "def",
					source: "./skills/local-skill",
					sourceType: "local",
				},
			},
		},
	},
] as unknown as ActionData;

/** Remark escapes `&` inside urls when it serializes the tree */
function unescape(markdown: string) {
	return markdown.replaceAll(String.raw`\&`, "&");
}

it("BADGE: renders a badge for each mcp server, linking http servers", async () => {
	mocks.getSimpleIconColor.mockImplementation((name: string) => [
		"000000",
		name,
	]);
	mocks.getContrastText.mockReturnValue("ffffff");

	const result = unescape(
		await processMarkdown(
			withZone("BADGE"),
			defaultConfig,
			badgeWithExtras,
		),
	);

	expect(result).toContain(
		"[![n8n-mcp](https://img.shields.io/badge/mcp-n8n--mcp-000000.svg?logo=modelcontextprotocol&logoColor=ffffff&labelColor=000000)](https://n8n.example.com/mcp-server/http)",
	);
	expect(result).toContain(
		"![karakeep](https://img.shields.io/badge/mcp-karakeep-000000.svg?logo=modelcontextprotocol",
	);
	expect(result).not.toContain("[![karakeep]");
	expect(result).not.toContain("N8N_MCP_TOKEN");
});

it("BADGE: renders a badge for each skill linking to its definition", async () => {
	mocks.getSimpleIconColor.mockImplementation((name: string) => [
		"181717",
		name,
	]);
	mocks.getContrastText.mockReturnValue("ffffff");

	const result = unescape(
		await processMarkdown(
			withZone("BADGE"),
			defaultConfig,
			badgeWithExtras,
		),
	);

	expect(result).toContain(
		"[![ab-testing](https://img.shields.io/badge/skill-ab--testing-181717.svg?logo=github&logoColor=ffffff&labelColor=181717)](https://github.com/coreyhaines31/marketingskills/blob/HEAD/skills/ab-testing/SKILL.md)",
	);
	expect(result).toContain("![local-skill](");
	expect(result).not.toContain("[![local-skill]");
});

it("BADGE: places mcp and skill badges after the dependency badges", async () => {
	mocks.getSimpleIconColor.mockReturnValue(["61DAFB", "react"]);

	const data = [
		{
			...(badgeWithExtras[0] as object),
			pkgJson: {
				dependencies: { react: "^18.0.0" },
				devDependencies: {},
				name: "my-package",
				version: "1.0.0",
			},
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("BADGE"),
		defaultConfig,
		data,
	);

	expect(result.indexOf("![react]")).toBeLessThan(
		result.indexOf("badge/mcp-"),
	);
	expect(result.indexOf("badge/mcp-")).toBeLessThan(
		result.indexOf("badge/skill-"),
	);
});

it("BADGE: skips mcp and skill badges with --skip-mcp / --skip-skills", async () => {
	const data = [
		{
			...(badgeWithExtras[0] as object),
			parameters: ["--skip-mcp", "--skip-skills"],
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("BADGE"),
		defaultConfig,
		data,
	);

	expect(result).not.toContain("badge/mcp-");
	expect(result).not.toContain("badge/skill-");
});

it("BADGE: renders nothing extra when no mcp or skills data is loaded", async () => {
	mocks.getSimpleIconColor.mockReturnValue([undefined, "unknown"]);

	const data = [
		{
			action: "BADGE",
			catalogs: undefined,
			parameters: [],
			pkgJson: { dependencies: {}, devDependencies: {}, name: "x" },
		},
	] as unknown as ActionData;

	const result = await processMarkdown(
		withZone("BADGE"),
		defaultConfig,
		data,
	);

	expect(result).not.toContain("badge/mcp-");
	expect(result).not.toContain("badge/skill-");
});

it("BADGE: strips credentials and query strings from mcp server links", async () => {
	const data = [
		{
			...(badgeWithExtras[0] as object),
			mcp: {
				mcpServers: {
					secret: {
						type: "http",
						url: "https://user:pass@mcp.example.com/path?token=abc#frag",
					},
				},
			},
		},
	] as unknown as ActionData;

	const result = unescape(
		await processMarkdown(withZone("BADGE"), defaultConfig, data),
	);

	expect(result).toContain("](https://mcp.example.com/path)");
	expect(result).not.toContain("user:pass");
	expect(result).not.toContain("token=abc");
});

it("BADGE: honors ref and sourceUrl from skills-lock.json", async () => {
	const data = [
		{
			...(badgeWithExtras[0] as object),
			skills: {
				skills: {
					elsewhere: {
						skillPath: "skills/elsewhere/SKILL.md",
						source: "owner/elsewhere",
						sourceType: "gitlab",
						sourceUrl: "https://gitlab.com/owner/elsewhere",
					},
					pinned: {
						ref: "v1.2.0",
						skillPath: "skills/pinned/SKILL.md",
						source: "owner/repo",
						sourceType: "github",
					},
					remote: {
						skillPath: "skills/remote/SKILL.md",
						source: "owner/other",
						sourceType: "github",
						sourceUrl: "https://github.com/owner/other.git",
					},
				},
			},
		},
	] as unknown as ActionData;

	const result = unescape(
		await processMarkdown(withZone("BADGE"), defaultConfig, data),
	);

	expect(result).toContain(
		"](https://github.com/owner/repo/blob/v1.2.0/skills/pinned/SKILL.md)",
	);
	expect(result).toContain(
		"](https://github.com/owner/other/blob/HEAD/skills/remote/SKILL.md)",
	);
	expect(result).toContain("](https://gitlab.com/owner/elsewhere)");
});

it("BADGE: does not treat look-alike hosts as github", async () => {
	const data = [
		{
			...(badgeWithExtras[0] as object),
			skills: {
				skills: {
					spoof: {
						skillPath: "skills/spoof/SKILL.md",
						source: "https://github.com.evil.example/owner/repo",
						sourceType: "github",
					},
				},
			},
		},
	] as unknown as ActionData;

	const result = unescape(
		await processMarkdown(withZone("BADGE"), defaultConfig, data),
	);

	expect(result).toContain("](https://github.com.evil.example/owner/repo)");
	expect(result).not.toContain("/blob/");
});
