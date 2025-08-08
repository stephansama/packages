import type { Root } from "mdast";
import type { Plugin } from "unified";

import { markdownTable } from "markdown-table";
import { fromMarkdown } from "mdast-util-from-markdown";
import { zone } from "mdast-zone";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { parseComment } from "./comment";

const emojis = {
	downloads: "📥",
	name: "📦",
	version: "🏷️",
} as const;

export const autoReadmeRemarkPlugin: Plugin<[Config, ActionData], Root> = (
	config,
	data,
) => {
	return function (tree) {
		zone(tree, /.*WORKSPACE.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const comment = value && parseComment(value);
			const first = data.find((d) => d?.action === "WORKSPACE");
			const pkgNames = first?.workspace
				?.map((pkg) => !pkg.private && pkg.name)
				.filter(Boolean);
			const table = markdownTable([
				["name", "version", "downloads"]
					.map((m) =>
						config.disableEmojis
							? m
							: emojis[m as keyof typeof emojis] + " " + m,
					)
					.map((m) => m.toUpperCase()),
				...(pkgNames
					? pkgNames.map((name) => [
							`[${name}](https://www.npmjs.com/package/${name})`,
							`[![NPM VERSION](https://img.shields.io/npm/v/${encodeURIComponent(name)}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/${name})`,
							`[![NPM DOWNLOADS](https://img.shields.io/npm/dw/${name}?labelColor=211F1F)](https://www.npmjs.com/package/${name})`,
						])
					: []),
				//
			]);

			const heading = `### ${first?.manager} packages`;
			const body = [heading, "", table].join("\n");
			const tableAst = fromMarkdown(body);
			return [start, tableAst, end];
		});
		zone(tree, /.*PKG.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			if (value) console.log({ config, value });
			const table = markdownTable([["name", "version", "test"]]);
			const tableAst = fromMarkdown(table);
			return [start, tableAst, end];
		});
	};
};
