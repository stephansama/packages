#!/usr/bin/env node

import { getPackages, type Package } from "@manypkg/get-packages";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";

interface StackblitzOverrides {
	openFile?: string;
	title?: string;
}

export interface Example {
	description: string | undefined;
	name: string;
	relativeDir: string;
	version: string;
	slug: string;
	framework: string;
	openFile: string | undefined;
	title: string;
}

const CONTENT_DIR_FROM_REPO_ROOT = path.join(
	"www",
	"docs",
	"src",
	"content",
	"docs",
	"examples",
);

const FRAMEWORK_OPEN_FILES: Array<{
	framework: string;
	deps: string[];
	candidates: string[];
}> = [
	{
		framework: "sveltekit",
		deps: ["@sveltejs/kit"],
		candidates: ["src/routes/+page.svelte"],
	},
	{
		framework: "react-router",
		deps: ["@react-router/dev", "react-router"],
		candidates: ["app/routes/home.tsx", "app/root.tsx", "src/App.tsx"],
	},
	{
		framework: "astro",
		deps: ["astro"],
		candidates: ["src/pages/index.astro"],
	},
	{
		framework: "vite",
		deps: ["vite"],
		candidates: ["index.html"],
	},
];

function detectFramework(pkg: Package): {
	framework: string;
	openFileCandidates: string[];
} {
	const allDeps = {
		...(pkg.packageJson.dependencies ?? {}),
		...(pkg.packageJson.devDependencies ?? {}),
	};
	for (const entry of FRAMEWORK_OPEN_FILES) {
		if (entry.deps.some((dep) => dep in allDeps)) {
			return {
				framework: entry.framework,
				openFileCandidates: entry.candidates,
			};
		}
	}
	return { framework: "unknown", openFileCandidates: [] };
}

function resolveOpenFile(
	pkg: Package,
	candidates: string[],
	override: string | undefined,
): string | undefined {
	const tryList = override ? [override, ...candidates] : candidates;
	for (const candidate of tryList) {
		if (fs.existsSync(path.join(pkg.dir, candidate))) return candidate;
	}
	return undefined;
}

function humanizeTitle(slug: string): string {
	const parts = slug.split("/");
	if (parts.length === 1) return parts[0]!;
	const [head, ...tail] = parts;
	const framework = tail
		.join(" ")
		.replace(
			/(^|\s|-)([a-z])/g,
			(_, sep, letter) => `${sep}${letter.toUpperCase()}`,
		);
	return `${head} — ${framework}`;
}

function escape(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function exampleMdx(example: Example): string {
	const depth = example.slug.split("/").length;
	const upward = "../".repeat(depth + 2);
	return `---
title: "${escape(example.title)}"
description: "${escape(example.description ?? `Example: ${example.name}`)}"
---

import StackblitzEmbed from "${upward}components/StackblitzEmbed.astro";

<StackblitzEmbed slug="${example.slug}" />
`;
}

function indexMdx(examples: Example[]): string {
	const cards = examples
		.map(
			(ex) =>
				`	<LinkCard
		title="${escape(ex.title)}"
		href="/examples/${ex.slug}/"
		description="${escape(ex.description ?? `Example: ${ex.name}`)}"
	/>`,
		)
		.join("\n");
	return `---
title: Examples
description: Live Stackblitz embeds for every package example.
---

import { CardGrid, LinkCard } from "@astrojs/starlight/components";

<CardGrid>
${cards}
</CardGrid>
`;
}

function writeMdx(repoRoot: string, examples: Example[]): void {
	const outDir = path.join(repoRoot, CONTENT_DIR_FROM_REPO_ROOT);
	fs.rmSync(outDir, { recursive: true, force: true });
	fs.mkdirSync(outDir, { recursive: true });

	for (const example of examples) {
		const filePath = path.join(outDir, `${example.slug}.mdx`);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, exampleMdx(example));
	}

	fs.writeFileSync(path.join(outDir, "index.mdx"), indexMdx(examples));
}

export async function generate({ writeToFile = true } = {}) {
	const { packages, rootDir } = await getPackages(process.cwd());
	const dirname = path.dirname(import.meta.filename);
	const outputDirectory = path.join(dirname, "../dist");

	fs.mkdirSync(outputDirectory, { recursive: true });

	const examples: Example[] = packages
		.filter((pkg) => {
			if (!pkg.relativeDir.startsWith("examples")) return false;

			const isNamedProperly = pkg.packageJson.name.includes("@example");
			const isPrivate = pkg.packageJson.private;

			if (!isNamedProperly) {
				throw new Error(
					`project ${pkg.packageJson.name} is not named properly please include @example prefix`,
				);
			}

			if (!isPrivate) {
				throw new Error(
					`project ${pkg.packageJson.name} is not private. please make the example private`,
				);
			}

			return true;
		})
		.map((pkg) => {
			const slug = pkg.relativeDir.replace(/^examples\//, "");
			const { framework, openFileCandidates } = detectFramework(pkg);
			const overrides = (
				pkg.packageJson as unknown as { stackblitz?: StackblitzOverrides }
			).stackblitz;
			const openFile = resolveOpenFile(
				pkg,
				openFileCandidates,
				overrides?.openFile,
			);
			const title = overrides?.title ?? humanizeTitle(slug);
			return {
				description: pkg.packageJson.description,
				name: pkg.packageJson.name,
				relativeDir: pkg.relativeDir,
				version: pkg.packageJson.version,
				slug,
				framework,
				openFile,
				title,
			};
		})
		.sort((a, b) => a.slug.localeCompare(b.slug));

	if (writeToFile) {
		fs.writeFileSync(
			path.join(outputDirectory, "examples.js"),
			`export default ${JSON.stringify(examples, undefined, 2)};\n`,
		);
		fs.writeFileSync(
			path.join(outputDirectory, "examples.d.ts"),
			`export interface Example {
	description: string | undefined;
	name: string;
	relativeDir: string;
	version: string;
	slug: string;
	framework: string;
	openFile: string | undefined;
	title: string;
}

declare const examples: Example[];
export default examples;
`,
		);
		writeMdx(rootDir, examples);
	}

	return examples;
}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) {
	await generate();
}
