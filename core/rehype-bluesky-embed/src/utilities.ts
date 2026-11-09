import type { Element, ElementContent, Root } from "hast";

export const OEMBED_ENDPOINT = "https://embed.bsky.app/oembed";

const BLUESKY_HOSTS = new Set(["bsky.app", "www.bsky.app"]);
const POST_PATH = /^\/profile\/[^/]+\/post\/[^/]+\/?$/;
const TRAILING_SLASH = /\/$/;

export function buildOEmbedURL(postURL: string) {
	const url = new URL(OEMBED_ENDPOINT);
	url.searchParams.set("url", postURL);
	url.searchParams.set("format", "json");
	return url.toString();
}

/** Keeps only the nodes worth inserting, optionally dropping `<script>` tags. */
export function cleanEmbed(root: Root, keepScript: boolean) {
	const nodes = root.children.filter((child): child is ElementContent => {
		if (child.type === "text") return child.value.trim() !== "";
		if (child.type !== "element") return false;
		if (child.tagName === "script") return keepScript;
		return true;
	});

	return nodes;
}

/**
 * Returns the canonical post URL when the input is a link to a Bluesky post
 * (`https://bsky.app/profile/<handle-or-did>/post/<rkey>`), otherwise
 * `undefined`. Query strings and fragments are dropped.
 */
export function getBlueskyPostURL(input: unknown) {
	if (typeof input !== "string") return;

	let url: URL;

	try {
		url = new URL(input);
	} catch {
		return;
	}

	if (url.protocol !== "https:" && url.protocol !== "http:") return;
	if (!BLUESKY_HOSTS.has(url.hostname)) return;
	if (!POST_PATH.test(url.pathname)) return;

	return `https://bsky.app${url.pathname.replace(TRAILING_SLASH, "")}`;
}

/**
 * A paragraph counts as "standalone" when its only content is a single link
 * (surrounding whitespace is ignored). Returns that link's post URL.
 */
export function getStandalonePostURL(node: Element) {
	if (node.tagName !== "p") return;

	const meaningful = node.children.filter(
		(child) => !(child.type === "text" && child.value.trim() === ""),
	);

	if (meaningful.length !== 1) return;

	const [link] = meaningful;

	if (link?.type !== "element" || link.tagName !== "a") return;

	return getBlueskyPostURL(link.properties.href);
}
