import type { Element, ElementContent, Root } from "hast";
import type { VFile } from "vfile";

import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";

import * as utilities from "./utilities";

export type RehypeBlueskyEmbedColorMode = "dark" | "light" | "system";

export interface RehypeBlueskyEmbedOptions {
	/**
	 * Cache of oEmbed HTML keyed by post URL. Shared across files by default so
	 * a post embedded on several pages is only fetched once per build.
	 */
	cache?: Map<string, Promise<string | undefined>>;
	/**
	 * Sets `data-bluesky-embed-color-mode` on the embed. Leave unset to use
	 * Bluesky's default (`system`).
	 */
	colorMode?: RehypeBlueskyEmbedColorMode;
	/** Custom fetch implementation (useful for tests or proxies). */
	fetch?: typeof globalThis.fetch;
	/** Maximum embed width in pixels. Bluesky accepts 220–600. */
	maxwidth?: number;
	/**
	 * Keep the `embed.bsky.app` `<script>` tag that comes with each embed. Turn
	 * this off when your site already loads the embed script once.
	 *
	 * @default true
	 */
	script?: boolean;
}

const defaultCache = new Map<string, Promise<string | undefined>>();

interface Match {
	index: number;
	node: Element;
	parent: Element | Root;
	url: string;
}

interface OEmbedResponse {
	html?: unknown;
}

/**
 * A rehype plugin that turns a paragraph containing only a link to a Bluesky
 * post into Bluesky's embed markup, fetched from its oEmbed endpoint at build
 * time. If a post can't be fetched, the link is left as it was and a warning is
 * added to the file.
 */
export default function rehypeBlueskyEmbed(
	options: RehypeBlueskyEmbedOptions = {},
) {
	const cache = options.cache ?? defaultCache;
	const fetchImpl = options.fetch ?? globalThis.fetch;
	const keepScript = options.script ?? true;

	function load(url: string) {
		let pending = cache.get(url);

		if (!pending) {
			pending = fetchEmbedHtml(fetchImpl, url, options.maxwidth);
			cache.set(url, pending);
		}

		return pending;
	}

	return async function transformer(tree: Root, file: VFile) {
		const matches: Match[] = [];

		visit(tree, "element", (node, index, parent) => {
			if (!parent || index === undefined) return;

			const url = utilities.getStandalonePostURL(node);

			if (url) matches.push({ index, node, parent, url });
		});

		if (matches.length === 0) return;

		const embeds = await Promise.all(
			matches.map(async (match) => {
				try {
					return await load(match.url);
				} catch {
					return;
				}
			}),
		);

		// Replace from the last match back so earlier indices stay valid.
		for (let index = matches.length - 1; index >= 0; index--) {
			const match = matches[index];
			const html = embeds[index];

			if (!html) {
				file.message(`Unable to load Bluesky embed for ${match.url}`, {
					place: match.node.position,
					ruleId: "fetch",
					source: "rehype-bluesky-embed",
				});
				continue;
			}

			const nodes = toNodes(html, keepScript, options.colorMode);

			if (nodes.length === 0) continue;

			match.parent.children.splice(match.index, 1, ...nodes);
		}
	};
}

async function fetchEmbedHtml(
	fetchImpl: typeof globalThis.fetch,
	url: string,
	maxwidth?: number,
) {
	const response = await fetchImpl(utilities.buildOEmbedURL(url, maxwidth), {
		headers: { accept: "application/json" },
	});

	if (!response.ok) return;

	const body = (await response.json()) as OEmbedResponse;

	return typeof body.html === "string" ? body.html : undefined;
}

function toNodes(
	html: string,
	keepScript: boolean,
	colorMode?: RehypeBlueskyEmbedColorMode,
): ElementContent[] {
	const nodes = utilities.cleanEmbed(
		fromHtml(html, { fragment: true }),
		keepScript,
	);

	if (colorMode) {
		for (const node of nodes) {
			if (node.type === "element" && node.tagName === "blockquote") {
				node.properties.dataBlueskyEmbedColorMode = colorMode;
			}
		}
	}

	return nodes;
}
