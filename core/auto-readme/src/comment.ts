import type { Html, Root } from "mdast";

import { commentMarker } from "mdast-comment-marker";

import { INFO } from "./log";
import { actionsSchema, formatsSchema, languageSchema } from "./schema";

export const SEPARATOR = "-" as const;

export type AstComments = ReturnType<typeof loadAstComments>;

export function loadAstComments(root: Root) {
	return root.children
		.map((child) => child.type === "html" && getComment(child))
		.filter((f): f is ReturnType<typeof parseComment> => f !== false);
}

export function parseComment(comment: string) {
	const input = trimComment(comment);
	const [type, ...parameters] = input.split(" ");
	const [first, second, third] = type.split(SEPARATOR);

	INFO("parsing inputs", { first, second, third });

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

const startComment = "<!--";
const endComment = "-->";

export function trimComment(comment: string) {
	return comment
		.replace(startComment, "")
		.replace(/start|end/, "")
		.replace(endComment, "")
		.trim();
}

function getComment(comment: Html) {
	if (!isComment(comment.value)) return false;

	const marker = commentMarker(comment);
	if (!marker) return false;

	// TODO: update parseComment to use comment marker
	return parseComment(comment.value);
}

function isComment(comment: string) {
	return comment.startsWith(startComment) && comment.endsWith(endComment);
}
