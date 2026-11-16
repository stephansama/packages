import type { Finding } from "../finding";

/**
 * `::warning` workflow commands, one per finding. The CLI also appends a
 * markdown table to `$GITHUB_STEP_SUMMARY` when it's set.
 */
export function formatGithub(findings: readonly Finding[]): string {
	return findings
		.map((finding) => {
			const parent = finding.parentVersion
				? `${finding.parent}@${finding.parentVersion}`
				: finding.parent;
			const message = `${parent} has ${finding.depType}.${finding.dependency} set to "${finding.spec}" (${finding.kind})`;
			return `::warning title=Floating dependency::${escapeData(message)}\n`;
		})
		.join("");
}

/** https://github.com/actions/toolkit/blob/main/packages/core/src/command.ts */
function escapeData(value: string) {
	return value
		.replaceAll("%", "%25")
		.replaceAll("\r", "%0D")
		.replaceAll("\n", "%0A");
}
