import { fromMarkdown } from "mdast-util-from-markdown";
import * as fsp from "node:fs/promises";
import z from "zod";

import { parseArgs } from "./args";
import { loadConfig } from "./config";
import { parse } from "./pipeline";
import { getGitRoot, getMarkdownPaths } from "./utils";

const mdActionsSchema = z.enum([
	"ACTIONS-INPUT",
	"PKG",
	"WORKSPACE",
	"ZOD",
] as const);
const mdFormatsSchema = z.enum(["LIST", "TABLE"] as const).default("TABLE");

export function isComment(html: string) {
	return html.startsWith("<!--") && html.endsWith("-->");
}

export function loadActions(root: ReturnType<typeof fromMarkdown>) {
	return root.children
		.filter(
			(r) =>
				r.type === "html" &&
				isComment(r.value) &&
				r.value.includes("start"),
		)
		.map((child) => {
			if (child.type !== "html") return false;
			const value = child.value
				.replace("<!--", "")
				.replace("-->", "")
				.replace("start", "")
				.trim();
			const [mdAction, mdFormat] = value.split(":");
			const action = mdActionsSchema.parse(mdAction);
			const format = mdFormatsSchema.parse(mdFormat);
			return [action, format];
		});
}

export async function run() {
	const args = await parseArgs();
	const config = await loadConfig(args);
	const root = getGitRoot();
	const paths = await getMarkdownPaths(root, config);
	const allData = (
		await Promise.all(
			paths.map(async (path) => {
				const file = await fsp.readFile(path, { encoding: "utf8" });
				const ast = fromMarkdown(file);
				const actions = loadActions(ast);
				const output = await parse(file, config);
				await fsp.writeFile(path, output.toString());
				if (actions.length) return [path, ast, actions];
			}),
		)
	).filter(Boolean);
	await fsp.writeFile("./output.json", JSON.stringify(allData, undefined, 2));
}
