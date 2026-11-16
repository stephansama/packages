import type { Finding } from "../finding";

/** One unique dependency name per line, like `ls -1` */
export function formatList(findings: readonly Finding[]): string {
	const names = new Set(findings.map((finding) => finding.dependency));
	return [...names]
		.toSorted((a, b) => a.localeCompare(b))
		.map((name) => name + "\n")
		.join("");
}
