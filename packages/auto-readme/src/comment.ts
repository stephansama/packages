import type { Root } from "mdast";

import { z } from "zod";

import { configSchema } from "./schema";

export const mdActionsSchema = z.enum([
	"ACTION",
	"PKG",
	"WORKSPACE",
	"ZOD",
] as const);

export const mdFormatsSchema = z
	.enum(["LIST", "TABLE"] as const)
	.default("TABLE")
	.optional();

export const mdLanguageSchema = configSchema.unwrap().shape.defaultLanguage;

export const SEPARATOR = "-" as const;

export function loadAstComments(root: Root) {
	return root.children
		.map((child) => child.type === "html" && parseComment(child.value))
		.filter((f): f is ReturnType<typeof parseComment> => f !== false);
}

export function parseComment(comment: string) {
	const input = comment
		.replace("<!--", "")
		.replace("-->", "")
		.replace(/start|end/, "")
		.trim();
	const [type, ...parameters] = input.split(" ");
	const [first, second, third] = type.split(SEPARATOR);
	const languageInput = third ? first : undefined;
	const actionInput = third ? second : first;
	const formatInput = third ? third : second;
	const language = mdLanguageSchema.parse(languageInput);
	const action = mdActionsSchema.parse(actionInput);
	const format = mdFormatsSchema.parse(formatInput);
	const isStart = comment.includes("start");
	return { action, format, isStart, language, parameters };
}
