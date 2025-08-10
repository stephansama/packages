import type { Root } from "mdast";
import type { Plugin } from "unified";

import Handlebars from "handlebars";
import { markdownTable } from "markdown-table";
import { fromMarkdown } from "mdast-util-from-markdown";
import { zone } from "mdast-zone";
import path from "node:path";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { parseComment } from "./comment";
import { defaultTableHeadings, defaultTemplates } from "./schema";

type TemplateContext = {
	name: string;
	uri_name: string;
};

function createHeading(
	headings: (keyof NonNullable<Config["templates"]>["emojis"])[],
	disableEmojis = false,
	emojis: typeof defaultTemplates.emojis = defaultTemplates.emojis,
) {
	return headings.map(
		(h) =>
			`${disableEmojis ? "" : emojis[h] + " "}${h?.at(0)?.toUpperCase() + h?.slice(1)}`,
	);
}

function wrapRequired(required: boolean | undefined, input: string) {
	if (!required) return input;
	return `<b>*${input}</b>`;
}

export const autoReadmeRemarkPlugin: Plugin<[Config, ActionData], Root> =
	(config, data) => (tree) => {
		zone(tree, /.*ZOD.*/gi, function (start, _, end) {
			const first = data.find((d) => d?.action === "ZOD");
			if (!first?.body) {
				throw new Error("unable to load zod body");
			}

			const ast = fromMarkdown(first.body);
			return [start, ast, end];
		});

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

			const headings =
				(config.headings?.ACTION?.length && config.headings.ACTION) ||
				defaultTableHeadings.ACTION!;

			const table = markdownTable([
				createHeading(
					headings,
					config.disableEmojis,
					config.templates?.emojis,
				),
				...Object.entries(inputs).map(([k, v]) =>
					headings
						.map((heading) => v[heading as keyof typeof v] || k)
						.map(String),
				),
			]);
			const body = [heading, "", table].join("\n");
			const ast = fromMarkdown(body);
			return [start, ast, end];
		});

		zone(tree, /.*WORKSPACE.*/gi, function (start, _, end) {
			// const value = start.type === "html" && start.value;
			// const options = value && parseComment(value);
			const first = data.find((d) => d?.action === "WORKSPACE");

			const packages = first?.workspaces.packages || [];

			const templates = loadTemplates(config.templates);

			const headings =
				(config.headings?.WORKSPACE?.length &&
					config.headings?.WORKSPACE) ||
				defaultTableHeadings.WORKSPACE!;

			const tableHeadings = createHeading(
				headings,
				config.disableEmojis,
				config.templates?.emojis,
			);

			const table = markdownTable([
				tableHeadings,
				...packages
					.filter((pkg) =>
						config.onlyShowPublicPackages
							? !pkg.packageJson.private
							: true,
					)
					.map((pkg) => {
						const { name } = pkg.packageJson;
						return headings.map((heading) => {
							if (heading === "name") {
								const scoped = config.removeScope
									? name.replace(config.removeScope, "")
									: name;
								return `[${scoped}](${path.resolve(pkg.relativeDir, "README.md")})`;
							}
							if (heading === "version") {
								return `![npm version image](${templates.versionImage(
									{ uri_name: encodeURIComponent(name) },
								)})`;
							}
							if (heading === "downloads") {
								return `![npm downloads](${templates.downloadImage(
									{ name },
								)})`;
							}
							if (heading === "description") {
								return (
									pkg.packageJson as { description?: string }
								)?.description;
							}
							return ``;
						});
					}),
			]);

			const heading = `### ${config.disableEmojis ? "" : "🏭"} workspace`;
			const body = [heading, "", table].join("\n");
			const ast = fromMarkdown(body);
			return [start, ast, end];
		});

		zone(tree, /.*PKG.*/gi, function (start, _, end) {
			// const value = start.type === "html" && start.value;
			// const comment = value && parseComment(value);
			const first = data.find((d) => d?.action === "PKG");
			const templates = loadTemplates(config.templates);
			const headings =
				(config.headings?.PKG?.length && config.headings?.PKG) ||
				defaultTableHeadings.PKG!;

			function mapDependencies(isDev: boolean) {
				return function ([name, version]: [string, string]) {
					const url = templates.registryUrl({ name });
					return headings.map((key) => {
						if (key === "devDependency") {
							if (config.disableEmojis) {
								return `\`${isDev}\``;
							}
							return `${isDev ? "⌨️" : "👥"}`;
						}
						if (key === "name") {
							return `[${name}](${url})`;
						}
						if (key === "version") {
							if (
								["workspace", "catalog", "*"].some((type) =>
									version.includes(type),
								)
							) {
								return `\`${version}\``;
							}

							return `![npm version](${templates.versionImage({ uri_name: encodeURIComponent(name) })})`;
						}
					});
				};
			}

			const { dependencies = {}, devDependencies = {} } =
				first?.pkgJson || {};

			const table = markdownTable([
				createHeading(
					headings,
					config.disableEmojis,
					config.templates?.emojis,
				),
				...Object.entries(devDependencies).map(mapDependencies(true)),
				...Object.entries(dependencies).map(mapDependencies(false)),
			]);

			const heading = `### ${config.disableEmojis ? "" : "📦"} packages`;
			const body = [heading, "", table].join("\n");
			const tableAst = fromMarkdown(body);

			return [start, tableAst, end];
		});
	};

function loadTemplates(
	templates: Config["templates"],
): Record<
	keyof NonNullable<Config["templates"]>,
	(context: Partial<TemplateContext>) => string
> {
	if (!templates) throw new Error("failed to load templates");

	return Object.fromEntries(
		Object.entries(templates).map(([key, value]) => {
			if (typeof value !== "string") return [];
			return [key, Handlebars.compile(value)];
		}),
	);
}
