import type { Paragraph, Root } from "mdast";

import { visit } from "unist-util-visit";

import * as utilities from "./utilities";

/**
 * Node type a standalone Bluesky post link paragraph is renamed to. Any plugin
 * that only matches `paragraph` nodes skips it.
 */
export const BLUESKY_LINK_PARAGRAPH = "blueskyLinkParagraph";

/**
 * A remark plugin for pipelines that also run an oEmbed plugin on the markdown
 * side (such as `remark-oembed`). Those plugins know Bluesky too and would swap
 * a standalone post link for their own widget before any rehype plugin runs.
 * This plugin renames those paragraphs so oEmbed plugins skip them, while they
 * still turn into a plain `<p>` with the link for `rehype-bluesky-embed`. Add
 * it before the oEmbed plugin.
 */
export function remarkBlueskyPassthrough() {
	return function transformer(tree: Root) {
		visit(tree, "paragraph", (node) => {
			if (!isStandalonePostLink(node)) return;

			const retyped = node as unknown as {
				data?: Paragraph["data"] & { hName?: string };
				type: string;
			};

			retyped.type = BLUESKY_LINK_PARAGRAPH;
			retyped.data = { ...retyped.data, hName: "p" };
		});
	};
}

function isStandalonePostLink(node: Paragraph) {
	const meaningful = node.children.filter(
		(child) => !(child.type === "text" && child.value.trim() === ""),
	);

	if (meaningful.length !== 1) return false;

	const [link] = meaningful;

	return (
		link?.type === "link" &&
		utilities.getBlueskyPostURL(link.url) !== undefined
	);
}
