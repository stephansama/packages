import type { Root } from "mdast";
import type { Plugin } from "unified";

import Handlebars from "handlebars";
import { markdownTable } from "markdown-table";
import { fromMarkdown } from "mdast-util-from-markdown";
import { zone } from "mdast-zone";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { parseComment } from "./comment";
import { defaultActionHeadings, defaultTemplates } from "./schema";

type TemplateContext = {
	name: string;
	uri_name: string;
};

function createHeading(
	headings: (keyof NonNullable<Config["templates"]>["emojis"])[],
	disableEmojis: boolean,
	emojis: NonNullable<Config["templates"]>["emojis"],
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

			const headings = (config.headings?.ACTION?.length &&
				config.headings.ACTION) || [
				"name",
				"required",
				"default",
				"description",
			];

			const table = markdownTable([
				createHeading(
					headings,
					config.disableEmojis || false,
					config.templates?.emojis || defaultTemplates.emojis,
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

			const templates = loadTemplates(config.templates);

			const headings =
				config.headings?.WORKSPACE || defaultActionHeadings.WORKSPACE!;

			const table = markdownTable([
				createHeading(
					headings,
					config.disableEmojis || false,
					config.templates?.emojis || defaultTemplates.emojis,
				),
				...(first?.workspaces.packages
					.filter((pkg) =>
						config.onlyShowPublicPackages
							? !pkg.packageJson.private
							: true,
					)
					.map((pkg) => {
						const name = pkg.packageJson.name;
						return headings.map((heading) => {
							if (heading === "name") {
								return `[${name}](${pkg.relativeDir})`;
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
					}) || []),
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
			const templates = loadTemplates(config.templates);
			const table = markdownTable([
				createHeading(
					config.headings?.PKG || ["name", "version", "downloads"],
					config.disableEmojis || false,
					config.templates?.emojis || defaultTemplates.emojis,
				),
				...(entries?.map(([name, value]) => {
					const url = templates.registryUrl({ name });
					return (
						config.headings?.PKG?.map((key) => {
							if (key === "name") {
								return `[${name}](${url})`;
							}
							if (key === "version") {
								return `![npm version](${templates.versionImage({ name })})`;
							}
						}) || []
					);
				}) || []),
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
