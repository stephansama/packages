import type { StandardSchemaV1 } from "@standard-schema/spec";

import * as path from "node:path";
import * as url from "node:url";

export function getFileContext(current = import.meta.url) {
	const urlPath = url.fileURLToPath(current);
	const isLinting = () => urlPath === process.argv[1];
	const templateDirectory = path.dirname(urlPath);
	return { isLinting, templateDirectory };
}

export async function validate<Schema extends StandardSchemaV1>(
	schema: Schema,
	data: StandardSchemaV1.InferInput<Schema>,
) {
	let issues: readonly StandardSchemaV1.Issue[] | undefined;

	const result = schema["~standard"].validate(data);

	if (result instanceof Promise) {
		const awaitedResult = await result;
		issues = awaitedResult.issues;
	} else issues = result.issues;

	if (issues) throw new Error(JSON.stringify(issues, undefined, 2));
}
