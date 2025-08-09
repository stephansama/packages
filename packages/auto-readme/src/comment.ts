import type { Root } from "mdast";

import { z } from "zod";

import { INFO } from "./log";
import { actionsSchema, configSchema } from "./schema";

export const formatsSchema = z
	.enum(["LIST", "TABLE"] as const)
	.default("TABLE")
	.optional();

export const languageSchema = configSchema.unwrap().shape.defaultLanguage;

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
	const language = languageSchema.parse(languageInput);
	const action = actionsSchema.parse(actionInput);
	const format = formatsSchema.parse(formatInput);
	const isStart = comment.includes("start");
	const parsed = { action, format, isStart, language, parameters };

	INFO(`Parsed comment ${comment}`, parsed);

	return parsed;
}
