export type ActionInput = {
	default?: string;
	description?: string;
	required?: boolean;
};

export type ActionYaml = { inputs?: Record<string, ActionInput> };

/** Shield styling shared by a group of badges */
export type BadgeStyle = {
	/** Hex color without the leading `#` */
	color: string;
	/** Shown on the left side of the collapsed summary badge */
	label: string;
	/** Simple-icons slug */
	logo: string;
};

export type BunWorkspace = { workspaces?: Workspace };

export type Catalog = Record<string, string>;

export type LoadedCatalogs = {
	catalogs?: Record<string, Catalog>;
	default?: Catalog;
};

/** A supported mcp configuration file and how to read it */
export type McpConfigFile = {
	/** Path relative to the readme */
	file: string;
	/** Normalize the tool specific shape into `mcpServers` */
	servers: (json: unknown) => Record<string, McpServer> | undefined;
};

export type McpJson = { mcpServers?: Record<string, McpServer> };

/** Normalized mcp server, the subset shared by every supported tool */
export type McpServer = {
	args?: string[];
	command?: string;
	type?: string;
	url?: string;
};

/** Untyped json object */
export type RawRecord = Record<string, unknown>;

/** Entry of a `skills-lock.json` written by the `skills` cli */
export type Skill = {
	ref?: string;
	skillPath?: string;
	source?: string;
	sourceType?: string;
	sourceUrl?: string;
};

export type SkillsLock = { skills?: Record<string, Skill> };

export type TemplateContext = {
	name: string;
	uri_name: string;
};

export type Workspace = {
	catalog: Catalog;
	catalogs: Record<string, Catalog>;
};
