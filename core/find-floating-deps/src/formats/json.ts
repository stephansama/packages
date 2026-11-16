import type { Finding } from "../finding";

import { summarize } from "../summary";

/** `{ findings, summary }` */
export function formatJson(findings: readonly Finding[]): string {
	return (
		JSON.stringify(
			{ findings, summary: summarize(findings) },
			undefined,
			2,
		) + "\n"
	);
}
