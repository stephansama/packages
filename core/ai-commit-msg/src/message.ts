import * as fsp from "node:fs/promises";

import { intentPrompt } from "./schema";

const scissorsLine = /^# -+ >8 -+$/m;

const placeholderMessages = new Set(["na", "nil", "none", "null"]);

/**
 * Build the final prompt from the configured template. when an existing message
 * is supplied it is substituted for `{{message}}`, or appended as intent
 * instructions if the template has no placeholder
 */
export function buildPrompt(template: string, diff: string, message?: string) {
	const values: Record<string, string> = { diff, message: message ?? "" };

	const hasMessagePlaceholder = template.includes("{{message}}");

	const fullTemplate =
		message && !hasMessagePlaceholder
			? `${template}\n\n${intentPrompt}`
			: template;

	return fullTemplate.replaceAll(
		/\{\{(diff|message)\}\}/g,
		(_, key: string) => values[key] ?? "",
	);
}

/**
 * Strip git comment lines and verbose diff output (everything after the
 * scissors line) from a commit message
 */
export function cleanMessage(message: string) {
	const [beforeScissors = ""] = message.split(scissorsLine);

	return beforeScissors
		.split("\n")
		.filter((line) => !line.startsWith("#"))
		.join("\n")
		.trim();
}

/**
 * Whether a message carries no intent (empty, punctuation only, or a variant of
 * n/a such as "N/A", "na", "n.a.", "none")
 */
export function isEmptyMessage(message: string) {
	const normalized = message.toLowerCase().replaceAll(/[^a-z0-9]/g, "");

	return !normalized || placeholderMessages.has(normalized);
}

/**
 * Read the existing commit message from the given file, returning undefined
 * when the file is missing or the message carries no intent
 */
export async function readExistingMessage(file: string) {
	const content = await fsp.readFile(file, "utf8").catch(() => "");

	const message = cleanMessage(content);

	if (isEmptyMessage(message)) return;

	return message;
}
