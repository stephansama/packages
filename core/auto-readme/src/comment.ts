import type { Html, Root } from "mdast";

import { commentMarker } from "mdast-comment-marker";

import { INFO } from "./log";
import { actionsSchema, formatsSchema, languageSchema } from "./schema";

const SEPARATOR = "-" as const;

export type AstComments = ReturnType<typeof loadAstComments>;

export type ParsedComment = Exclude<ReturnType<typeof parseComment>, false>;

export function loadAstComments(root: Root) {
	return root.children
		.map((child) => child.type === "html" && getComment(child))
		.filter((f): f is ParsedComment => !!f);
}

/**
 * Parse an action comment, returning `false` for any other html comment. Throws
 * when the action is known but its language or format is not
 */
export function parseComment(comment: string) {
	const input = trimComment(comment);
	const [type, ...parameters] = input.split(" ");
	const [first, second, third] = type.split(SEPARATOR);

	INFO("parsing inputs", { first, second, third });

	const languageInput = third ? first : undefined;
	const actionInput = third ? second : first;
	const formatInput = third || second;
	const language = languageSchema.safeParse(languageInput);
	const action = actionsSchema.safeParse(actionInput);
	const format = formatsSchema.safeParse(formatInput);

	if (!action.success) {
		INFO(`Skipping non action comment ${comment}`);
		return false;
	}

	// a known action with a bad language or format is a typo, not a stray comment
	if (!language.success) {
		throw new Error(
			`Invalid language "${languageInput}" in ${comment}: ${language.error.issues[0]?.message}`,
		);
	}

	if (!format.success) {
		throw new Error(
			`Invalid format "${formatInput}" in ${comment}: ${format.error.issues[0]?.message}`,
		);
	}

	const isStart = comment.includes("start");
	const parsed = {
		action: action.data,
		format: format.data,
		isStart,
		language: language.data,
		parameters,
	};

	INFO(`Parsed comment ${comment}`, parsed);

	return parsed;
}

const startComment = "<!--";
const endComment = "-->";

const commentRegex = /start|end/;

export function trimComment(comment: string) {
	return comment
		.replace(startComment, "")
		.replace(commentRegex, "")
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
