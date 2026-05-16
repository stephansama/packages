import type { Root } from "mdast";
import type { Plugin } from "unified";

import { zone } from "@stephansama/mdast-zone";
import Handlebars from "handlebars";
import { markdownTable } from "markdown-table";
import { fromMarkdown } from "mdast-util-from-markdown";
import path from "node:path";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { getContrastText } from "./color";
import { parseComment } from "./comment";
import { getSimpleIconColor } from "./icon";
import { INFO } from "./log";
import { defaultTableHeadings, defaultTemplates } from "./schema";
import { resolveVersion } from "./utilities";

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
			const zod = data.find((d) => d?.action === "ZOD");
			if (!zod?.body) {
				throw new Error("unable to load zod body");
			}

			const ast = fromMarkdown(zod.body);
			return [start, ast, end];
		});

		zone(tree, /.*BADGE.*/gi, function (start, _, end) {
			const first = data.find((d) => d?.action === "BADGE");
			const dependencyTypes = config.badgeOptions?.dependencyTypes || [
				"dependencies",
				"devDependencies",
			];

			const allDependencies = Object.assign<
				Record<string, string>,
				Record<string, string>
			>(
				{},
				// @ts-expect-error no error
				...dependencyTypes.map(
					(dependencyType) => first?.pkgJson?.[dependencyType] || {},
				),
			);

			const skipTemplates =
				first?.parameters.includes(`--skip-templates`);

			const templateBadges =
				(!skipTemplates &&
					config.badgeOptions?.templates.map((template) => {
						type TemplateType = Partial<
							Record<
								| "escaped_name"
								| "key"
								| "name"
								| "unscoped_name"
								| "value"
								| "version",
								string
							>
						>;

						const compiledImage = Handlebars.compile<TemplateType>(
							template.image,
						);

						const compiledUrl = Handlebars.compile<TemplateType>(
							template.url,
						);

						const name = first?.pkgJson?.name || "";
						const version = first?.pkgJson?.version;
						const scope =
							(first?.pkgJson?.name?.includes("@") &&
								first.pkgJson.name.split("/").at(0)) ||
							"";

						const context = {
							escaped_name: encodeURIComponent(name),
							key: name,
							name,
							scope,
							unscoped_name: name?.replace(`${scope}/`, ""),
							value: version,
							version,
						};

						const image = compiledImage(context);
						const url = compiledUrl(context);

						return `[![${template.label}](${image})](${url})`;
					})) ||
				[];

			const packageBadges = new Array<string>();
			const md = String.raw;

			INFO(JSON.stringify(allDependencies, undefined, 2));

			for (const [key, version] of Object.entries(allDependencies)) {
				const [color, slug] = getSimpleIconColor(key);
				if (!color) continue;

				const contrastText = getContrastText(color);
				const linkUrl = `https://npmx.dev/package/${key}`;
				const badgeKey = key
					.replaceAll("-", "--")
					.replaceAll("_", "__");
				const imageUrl = `https://img.shields.io/badge/${badgeKey}-${resolveVersion(
					{
						catalogs: first?.catalogs,
						name: key,
						version,
					},
				)}-${color}.svg?logo=${slug}&logoColor=${contrastText}&labelColor=${color}`;
				packageBadges.push(md`[![${key}](${imageUrl})](${linkUrl})`);
			}

			const ast = fromMarkdown(
				[
					templateBadges.filter(Boolean).join("\n"),
					packageBadges.filter(Boolean).join("\n"),
				].join("\n\n"),
			);

			return [start, ast, end];
		});

		zone(tree, /.*ACTION.*/gi, function (start, _, end) {
			const value = start.type === "html" && start.value;
			const options = value && parseComment(value);
			if (!options) throw new Error("not able to parse comment");

			const first = data.find((d) => d?.action === "ACTION");
			const inputs = first?.actionYaml?.inputs || {};
			const heading = `### ${config.disableEmojis ? "" : "🧰"} actions`;

			if (options.format === "LIST") {
				const body =
					`${heading}\n` +
					Object.entries(inputs)
						.toSorted((a) => (a[1].required ? -1 : 1))
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
			const value = start.type === "html" && start.value;
			const comment = value && parseComment(value);
			const workspace = data.find((d) => d?.action === "WORKSPACE");
			const templates = loadTemplates(config.templates);
			const packages = workspace?.workspaces?.packages || [];
			const headings =
				(config.headings?.WORKSPACE?.length &&
					config.headings?.WORKSPACE) ||
				defaultTableHeadings.WORKSPACE!;

			if (comment && comment.format === "LIST") {
				// throw new Error("List is currently not su")
			}

			const tableHeadings = createHeading(
				headings,
				config.disableEmojis,
				config.templates?.emojis,
			);

			const table = markdownTable([
				tableHeadings || [],
				...packages
					.filter((pkg) =>
						config.onlyShowPublicPackages
							? !pkg.packageJson.private
							: true,
					)
					.map((pkg) => {
						const { name } = pkg.packageJson;
						return headings?.map((heading) => {
							if (heading === "name") {
								const scoped = config.removeScope
									? name.replace(config.removeScope, "")
									: name;
								return `[${scoped}](${path.relative(
									process.cwd(),
									path.resolve(pkg.dir, "README.md"),
								)})`;
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
			const value = start.type === "html" && start.value;
			const comment = value && parseComment(value);
			const first = data.find((d) => d?.action === "PKG");
			const templates = loadTemplates(config.templates);
			const headings =
				(config.headings?.PKG?.length && config.headings?.PKG) ||
				defaultTableHeadings.PKG!;

			if (comment && comment.format === "LIST") {
				const ast = fromMarkdown("");
				return [start, ast, end];
			}

			function mapDependencies(isDevelopment: boolean) {
				return function ([name, version]: [string, string]) {
					const url = templates.registryUrl({ name });
					return headings.map((key) => {
						if (key === "devDependency") {
							if (config.disableEmojis) {
								return `\`${isDevelopment}\``;
							}
							return `${isDevelopment ? "⌨️" : "👥"}`;
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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Object.fromEntries(
		Object.entries(templates).map(([key, value]) => {
			if (typeof value !== "string") return [];
			return [key, Handlebars.compile(value)];
		}),
	);
}
