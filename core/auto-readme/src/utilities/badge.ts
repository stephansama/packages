import type { SimpleIcon } from "simple-icons";

import { makeBadge } from "badge-maker";
import * as icons from "simple-icons";

import type { BadgeStyle, McpServer, Skill } from "./types";

import { getContrastText } from "../color";
import { getSimpleIconColor } from "../icon";
import { getMcpServerUrl } from "./mcp";
import { getSkillUrl } from "./skills";

/**
 * Join a group of badges, wrapping them in a collapsed `<details>` block once
 * the group grows past `after` entries so long lists stay out of the way. The
 * summary is a badge of its own showing the group logo, name and count
 */
export function collapseBadges(
	badges: string[],
	style: BadgeStyle,
	after: number,
) {
	const body = badges.join("\n");
	if (badges.length <= after) return body;
	const count = String(badges.length);
	const image = createShieldImage(
		style.label,
		count,
		style.color,
		style.logo,
	);
	// markdown is not parsed inside <summary>, so the badge is an <img> tag
	const summary = `<summary><img alt="${style.label}" src="${image}"></summary>`;
	return ["<details>", summary, "", body, "", "</details>"].join("\n");
}

export function createBadge(label: string, image: string, url?: string) {
	const badge = `![${label}](${image})`;
	return url ? `[${badge}](${url})` : badge;
}

/**
 * Badge for a server defined in an mcp configuration next to the readme. The
 * label is left empty so only the mcp logo shows next to the server name
 */
export function createMcpBadge(name: string, server: McpServer) {
	const { color, logo } = getMcpBadgeStyle();
	const image = createShieldImage("", name, color, logo);
	return createBadge(name, image, getMcpServerUrl(server));
}

/**
 * Shield image in the same style as the dependency badges, rendered locally
 * with `badge-maker` and inlined as a `data:image/svg+xml` uri so readers
 * never hit the shields.io cdn. An empty label renders only the logo on the
 * left side of the badge
 */
export function createShieldImage(
	label: string,
	message: string,
	color: string,
	logo: string,
) {
	const contrastText = getContrastText(color);
	const logoBase64 = createLogoDataUri(logo, contrastText);
	const svg = makeBadge({
		color: `#${color}`,
		label,
		labelColor: `#${color}`,
		message,
		style: "flat",
		...(logoBase64 && { logoBase64 }),
	});
	return toSvgDataUri(svg);
}

/**
 * Badge for a skill defined in a `skills-lock.json` next to the readme. The
 * label is left empty so only the logo shows next to the skill name
 */
export function createSkillBadge(name: string, skill: Skill) {
	const { color, logo } = getSkillBadgeStyle();
	const image = createShieldImage("", name, color, logo);
	return createBadge(name, image, getSkillUrl(skill));
}

/** Logo and color shared by every mcp badge and the collapsed summary */
export function getMcpBadgeStyle(): BadgeStyle {
	const [color, logo] = getSimpleIconColor("modelcontextprotocol");
	return { color: color || "000000", label: "mcp", logo };
}

/**
 * Logo and color shared by every skill badge and the collapsed summary. Uses
 * the vercel logo since the lock file is written by vercel's `skills` cli
 */
export function getSkillBadgeStyle(): BadgeStyle {
	const [color, logo] = getSimpleIconColor("vercel");
	return { color: color || "000000", label: "skills", logo };
}

let iconsBySlug: Map<string, SimpleIcon> | undefined;

/**
 * Simple icon for `slug` filled with `color` as a base64 svg data uri, the
 * shape `badge-maker` expects for `logoBase64`. Unknown slugs render no logo
 */
export function createLogoDataUri(slug: string, color: string) {
	iconsBySlug ??= new Map(
		Object.values(icons).map((icon: SimpleIcon) => [icon.slug, icon]),
	);
	const icon = iconsBySlug.get(slug);
	if (!icon) return;
	return toSvgDataUri(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#${color}" d="${icon.path}"/></svg>`,
	);
}

export function toSvgDataUri(svg: string) {
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
