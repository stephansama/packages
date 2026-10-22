import type { McpServer, Skill } from "./types";

import { getContrastText } from "../color";
import { getSimpleIconColor } from "../icon";
import { SHIELD_URL } from "./constants";
import { getMcpServerUrl } from "./mcp";
import { getSkillUrl } from "./skills";

export function createBadge(label: string, image: string, url?: string) {
	const badge = `![${label}](${image})`;
	return url ? `[${badge}](${url})` : badge;
}

/** Badge for a server defined in an mcp configuration next to the readme */
export function createMcpBadge(name: string, server: McpServer) {
	const [color, slug] = getSimpleIconColor("modelcontextprotocol");
	const image = createShieldImage("mcp", name, color || "000000", slug);
	return createBadge(name, image, getMcpServerUrl(server));
}

/** Shield image in the same style as the dependency badges */
export function createShieldImage(
	label: string,
	message: string,
	color: string,
	logo: string,
) {
	const contrastText = getContrastText(color);
	return `${SHIELD_URL}/${escapeShield(label)}-${escapeShield(message)}-${color}.svg?logo=${logo}&logoColor=${contrastText}&labelColor=${color}`;
}

/** Badge for a skill defined in a `skills-lock.json` next to the readme */
export function createSkillBadge(name: string, skill: Skill) {
	const [color, slug] = getSimpleIconColor("github");
	const image = createShieldImage("skill", name, color || "181717", slug);
	return createBadge(name, image, getSkillUrl(skill));
}

/** Escape a shields.io path segment, see https://shields.io/badges */
export function escapeShield(input: string) {
	return encodeURIComponent(
		input.replaceAll("-", "--").replaceAll("_", "__"),
	);
}
