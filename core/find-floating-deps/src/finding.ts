/** How a floating range can move to a newer version than the installed one */
export const kinds = [
	"wildcard",
	"tag",
	"caret",
	"tilde",
	"comparison",
	"hyphen",
	"x-range",
	"partial",
	"union",
	"intersection",
] as const;

export type Kind = (typeof kinds)[number];

export const depTypes = [
	"dependencies",
	"optionalDependencies",
	"peerDependencies",
	"devDependencies",
] as const;

export type DepType = (typeof depTypes)[number];

/**
 * Peers resolve against the consumer and pnpm never installs third-party
 * devDependencies, so only these are checked unless asked otherwise
 */
export const defaultDepTypes = [
	"dependencies",
	"optionalDependencies",
] as const satisfies DepType[];

export const fields = [
	"parent",
	"parentVersion",
	"dependency",
	"spec",
	"depType",
	"kind",
	"resolved",
	"pinnable",
	"catalog",
] as const;

export type Field = (typeof fields)[number];

/** One floating range declared by `parent@parentVersion` */
export type Finding = {
	/** The pnpm catalog the range came from, for `catalog:` specs */
	catalog?: string;
	dependency: string;
	depType: DepType;
	kind: Kind;
	parent: string;
	parentVersion: string;
	/** Whether `pinAllDependencies` from `@stephansama/pnpm-hooks` pins it */
	pinnable: boolean;
	/** The version it is installed as, when it is installed */
	resolved?: string;
	/** The range as written, or the catalog's range for `catalog:` specs */
	spec: string;
};
