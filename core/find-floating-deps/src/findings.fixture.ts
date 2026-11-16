import type { Finding } from "./finding";

/** A fixed set of findings for formatter tests */
export const fixtureFindings: Finding[] = [
	{
		dependency: "@types/node",
		depType: "dependencies",
		kind: "wildcard",
		parent: "@types/ws",
		parentVersion: "8.18.1",
		pinnable: false,
		resolved: "24.12.2",
		spec: "*",
	},
	{
		dependency: "picocolors",
		depType: "dependencies",
		kind: "caret",
		parent: "vite",
		parentVersion: "6.3.5",
		pinnable: true,
		resolved: "1.1.1",
		spec: "^1.1.1",
	},
	{
		dependency: "react",
		depType: "optionalDependencies",
		kind: "union",
		parent: "needs,quoting",
		parentVersion: "1.0.0",
		pinnable: false,
		spec: '^18 || "19"',
	},
];
