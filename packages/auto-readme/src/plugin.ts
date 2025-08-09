import type { Root } from "mdast";
import type { Plugin } from "unified";

import Handlebars from "handlebars";
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

function wrapRequired(required: boolean | undefined, input: string) {
	if (!required) return input;
	return `<b>*${input}</b>`;
}

export const autoReadmeRemarkPlugin: Plugin<[Config, ActionData], Root> =
	(config, data) => (tree) => {
		zone(tree, /.*ACTION.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const options = value && parseComment(value);
			if (!options) throw new Error("not able to parse comment");

			const first = data.find((d) => d?.action === "ACTION");

			const inputs = first?.actionYaml.inputs || {};

			const heading = `### ${config.disableEmojis ? "" : "🧰"} actions`;

			if (options.format === "LIST") {
				const body =
					`${heading}\n` +
					Object.entries(inputs)
						.sort((a) => (a[1].required ? -1 : 1))
						.map(([key, value]) => {
							return `- ${wrapRequired(value.required, key)}: (default: ${value.default})\n\n${value.description}`;
						})
						.join("\n");
				const ast = fromMarkdown(body);
				return [start, ast, end];
			}

			const table = markdownTable([
				createHeading(
					["name", "required", "default", "description"],
					config.disableEmojis || false,
				),
				...Object.entries(inputs).map(([k, v]) =>
					[k, v.required, v.default, v.description].map(String),
				),
			]);
			const body = [heading, "", table].join("\n");
			const ast = fromMarkdown(body);
			return [start, ast, end];
		});

		zone(tree, /.*WORKSPACE.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const options = value && parseComment(value);
			const first = data.find((d) => d?.action === "WORKSPACE");

			const versionImageTemplate = Handlebars.compile(
				config.templates?.versionImage,
			);

			const table = markdownTable([
				createHeading(
					["name", "version", "downloads"],
					config.disableEmojis || false,
				),
				...(first?.workspaces.packages
					.filter((pkg) =>
						config.onlyShowPublicPackages
							? !pkg.packageJson.private
							: true,
					)
					.map((pkg) => [
						`[${pkg.packageJson.name}](${path.resolve(pkg.dir, "README.md")})`,
						`![npm version image](${versionImageTemplate({ uri_name: encodeURIComponent(pkg.packageJson.name) })})`,
						`[![NPM DOWNLOADS](https://img.shields.io/npm/dw/${pkg.packageJson.name}?labelColor=211F1F)](https://www.npmjs.com/package/${pkg.packageJson.name})`,
					]) || []),
			]);

			const heading = `### ${config.disableEmojis ? "" : "🏭"} workspace`;
			const body = [heading, "", table].join("\n");
			const tableAst = fromMarkdown(body);
			return [start, tableAst, end];
		});

		zone(tree, /.*ZOD.*/gi, function (start, _, end) {
			const first = data.find((d) => d?.action === "ZOD");
			if (!first?.body) {
				throw new Error("unable to load zod body");
			}

			const ast = fromMarkdown(first.body);

			return [start, ast, end];
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
			const heading = `### ${config.disableEmojis ? "" : "📦"} packages`;
			const body = [heading, "", table].join("\n");
			const tableAst = fromMarkdown(body);
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
