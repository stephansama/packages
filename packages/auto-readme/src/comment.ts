import type { Root } from "mdast";

import { INFO } from "./log";
import { actionsSchema, formatsSchema, languageSchema } from "./schema";

export const SEPARATOR = "-" as const;

export type AstComments = ReturnType<typeof loadAstComments>;

export function loadAstComments(root: Root) {
	return root.children
		.map((child) => child.type === "html" && parseComment(child.value))
		.filter((f): f is ReturnType<typeof parseComment> => f !== false);
}

export function parseComment(comment: string) {
	const input = trimComment(comment);
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

export function trimComment(comment: string) {
	return comment
		.replace("<!--", "")
		.replace("-->", "")
		.replace(/start|end/, "")
		.trim();
}
