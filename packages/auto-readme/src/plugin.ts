import type { Root } from "mdast";
import type { Plugin } from "unified";

import { markdownTable } from "markdown-table";
import { fromMarkdown } from "mdast-util-from-markdown";
import { zone } from "mdast-zone";
import * as path from "node:path";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { parseComment } from "./comment";

const emojis = {
	default: "⚙️",
	description: "📝",
	downloads: "📥",
	name: "🏷️",
	private: "🔒",
	required: "",
	version: "🔢",
} as const;

function createHeading(
	headings: (keyof typeof emojis)[],
	disableEmojis: boolean,
) {
	return headings.map(
		(h) =>
			`${disableEmojis ? "" : emojis[h] + " "}${h?.at(0) + h?.slice(1)}`,
	);
}

export const autoReadmeRemarkPlugin: Plugin<[Config, ActionData], Root> =
	(config, data) => (tree) => {
		zone(tree, /.*ACTION.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const options = value && parseComment(value);
			const first = data.find((d) => d?.action === "ACTION");
			const table = markdownTable([
				createHeading(
					["name", "required", "default", "description"],
					config.disableEmojis || false,
				),
				...Object.entries(first?.actionYaml.inputs || {}).map(
					([k, v]) =>
						[k, v.required, v.default, v.description].map(String),
				),
			]);
			const heading = `### actions`;
			const body = [heading, "", table].join("\n");
			const ast = fromMarkdown(body);
			return [start, ast, end];
		});

		zone(tree, /.*WORKSPACE.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const options = value && parseComment(value);
			const first = data.find((d) => d?.action === "WORKSPACE");
			const table = markdownTable([
				createHeading(
					["name", "version", "downloads"],
					config.disableEmojis || false,
				),
				...(first?.workspaces.packages.map((pkg) => [
					`[${pkg.packageJson.name}](${path.resolve(pkg.dir, "README.md")})`,
					`\`${pkg.packageJson.version || ""}\``,
					`[![NPM DOWNLOADS](https://img.shields.io/npm/dw/${pkg.packageJson.name}?labelColor=211F1F)](https://www.npmjs.com/package/${pkg.packageJson.name})`,
				]) || []),
			]);

			const heading = `### packages`;
			const body = [heading, "", table].join("\n");
			const tableAst = fromMarkdown(body);
			return [start, tableAst, end];
		});

		zone(tree, /.*PKG.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const comment = value && parseComment(value);
			const first = data.find((d) => d?.action === "PKG");
			const entries = [
				...Object.entries(first?.pkgJson.dependencies || {}),
				...Object.entries(first?.pkgJson.devDependencies || {}),
			];
			const pkgNames = entries.map(([k]) => k);
			const table = markdownTable([
				createHeading(
					["name", "version", "downloads"],
					config.disableEmojis || false,
				),
				...pkgNames.map(pkgTable),
			]);
			const tableAst = fromMarkdown(table);
			return [start, tableAst, end];
		});
	};

function pkgTable(name: string) {
	return [
		`[${name}](https://www.npmjs.com/package/${name})`,
		`[![NPM VERSION](https://img.shields.io/npm/v/${encodeURIComponent(name)}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/${name})`,
		`[![NPM DOWNLOADS](https://img.shields.io/npm/dw/${name}?labelColor=211F1F)](https://www.npmjs.com/package/${name})`,
	];
}
