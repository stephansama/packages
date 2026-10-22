/** Lock file written by the `skills` cli next to a readme */
export const SKILLS_LOCK_FILE = "skills-lock.json";

export const GITHUB_HOST = "github.com";
export const GITHUB_URL = `https://${GITHUB_HOST}`;
export const SHIELD_URL = "https://img.shields.io/badge";

/** Optional trailing `.git` and `/` on a repository url */
export const GIT_SUFFIX = /(?:\.git)?\/?$/;
export const HTTP_PROTOCOL = /^https?:\/\//;

/** Globs never traversed when looking for markdown files */
export const IGNORED_GLOBS = ["**/node_modules/**"];

/**
 * Staged files that cause the nearest readme to be regenerated when running
 * with `--changes`
 */
export const AFFECTED_FILE_MATCHES = [
	/.*README\.md$/gi,
	/.*Cargo\.toml$/gi,
	/.*action\.ya?ml$/gi,
	/.*package\.json$/gi,
	/.*pnpm-workspace\.yaml$/gi,
	/.*\.mcp\.json$/gi,
	/.*skills-lock\.json$/gi,
	// mcp configuration files of other tools, see MCP_CONFIG_FILES
	/.*\.claude-plugin\/plugin\.json$/gi,
	/.*\.(cursor|vscode|roo|amazonq)\/mcp\.json$/gi,
	/.*\.kiro\/settings\/mcp\.json$/gi,
	/.*\.(gemini|zed)\/settings\.json$/gi,
	/.*opencode\.jsonc?$/gi,
];
