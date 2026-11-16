import type { Finding } from "../finding";

/** One JSON finding per line, also called ndjson */
export function formatJsonl(findings: readonly Finding[]): string {
	return findings.map((finding) => JSON.stringify(finding) + "\n").join("");
}
