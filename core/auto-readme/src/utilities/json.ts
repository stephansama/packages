import type { ParseError } from "jsonc-parser";

import { parse as parseJSONC, printParseErrorCode } from "jsonc-parser";
import * as fsp from "node:fs/promises";
import path from "node:path";

import type { RawRecord } from "./types";

import { INFO } from "../log";
import { fileExists } from "./files";

export function isRecord(input: unknown): input is RawRecord {
	return typeof input === "object" && input !== null && !Array.isArray(input);
}

/** Load an optional json file that lives in the same directory as the readme */
export async function loadJsonBesideReadme<T>(
	readme: string,
	filename: string,
): Promise<T | undefined> {
	const filePath = path.resolve(path.dirname(readme), filename);

	if (!(await fileExists(filePath))) return;

	INFO(`found ${filename} next to readme`, filePath);

	const contents = await fsp.readFile(filePath, { encoding: "utf8" });

	// jsonc so that files like opencode.jsonc or .vscode/mcp.json may contain
	// comments and trailing commas
	const errors: ParseError[] = [];
	const parsed = parseJSONC(contents, errors, {
		allowEmptyContent: false,
		allowTrailingComma: true,
	}) as T;

	const [first] = errors;
	if (first) {
		const reason = printParseErrorCode(first.error);
		throw new Error(
			`unable to parse ${filePath}: ${reason} at offset ${first.offset}`,
		);
	}

	return parsed;
}

export function pickRecord(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	return isRecord(value) ? value : undefined;
}

export function pickString(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	return typeof value === "string" ? value : undefined;
}

export function pickStrings(input: unknown, key: string) {
	if (!isRecord(input)) return;
	const value = input[key];
	if (!Array.isArray(value)) return;
	return value.every((v): v is string => typeof v === "string")
		? value
		: undefined;
}
