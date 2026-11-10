import type { Root as MdastRoot } from "mdast";

import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { describe, expect, it, vi } from "vitest";

import plugin, {
	type RehypeBlueskyEmbedOptions,
	remarkBlueskyPassthrough,
} from "../src/index";
import { buildOEmbedURL, getBlueskyPostURL } from "../src/utilities";

const POST_URL = "https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l";

const OEMBED_HTML =
	'<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l" data-bluesky-cid="bafyreiexample"><p lang="en">Hello from Bluesky</p>&mdash; Bluesky (<a href="https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur?ref_src=embed">@bsky.app</a>)</blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>';

/**
 * Collects the URL of every paragraph whose only child is a link, the way
 * remark-oembed picks what to embed.
 */
function collectStandaloneLinks(seen: string[]) {
	return (tree: MdastRoot) => {
		visit(tree, "paragraph", (node) => {
			const [child] = node.children;

			if (node.children.length === 1 && child?.type === "link") {
				seen.push(child.url);
			}
		});
	};
}

function mockFetch(html: string | undefined = OEMBED_HTML, ok = true) {
	return vi.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve({ html }),
			ok,
		} as Response),
	);
}

async function run(input: string, options: RehypeBlueskyEmbedOptions = {}) {
	const file = await unified()
		.use(rehypeParse, { fragment: true })
		.use(plugin, { cache: new Map(), ...options })
		.use(rehypeStringify)
		.process(input);

	return file;
}

const standalone = `<p><a href="${POST_URL}">${POST_URL}</a></p>`;

describe("getBlueskyPostURL", () => {
	it("accepts post links and normalizes them", () => {
		expect(getBlueskyPostURL(`${POST_URL}?ref_src=embed#x`)).toBe(POST_URL);
		expect(
			getBlueskyPostURL(`https://www.bsky.app/profile/a.b/post/c/`),
		).toBe("https://bsky.app/profile/a.b/post/c");
	});

	it("rejects anything that isn't a post link", () => {
		expect(getBlueskyPostURL("https://bsky.app/profile/bsky.app")).toBe(
			undefined,
		);
		expect(getBlueskyPostURL("https://example.com/profile/a/post/b")).toBe(
			undefined,
		);
		expect(getBlueskyPostURL("not a url")).toBeUndefined();
		expect(getBlueskyPostURL(42)).toBeUndefined();
	});
});

describe("buildOEmbedURL", () => {
	it("points at Bluesky's oEmbed endpoint with the post URL", () => {
		const url = new URL(buildOEmbedURL(POST_URL));
		expect(url.origin + url.pathname).toBe("https://embed.bsky.app/oembed");
		expect(url.searchParams.get("url")).toBe(POST_URL);
		expect(url.searchParams.get("format")).toBe("json");
	});
});

describe("rehype bluesky embed", () => {
	it("replaces a standalone post link with the embed", async () => {
		const fetch = mockFetch();
		const file = await run(standalone, { fetch });

		expect(String(file)).toBe(OEMBED_HTML.replace("&mdash;", "—"));
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(file.messages).toHaveLength(0);
	});

	it("drops the script tag when script is false", async () => {
		const file = await run(standalone, {
			fetch: mockFetch(),
			script: false,
		});
		const output = String(file);

		expect(output).toContain('<blockquote class="bluesky-embed"');
		expect(output).not.toContain("<script");
	});

	it("sets the color mode on the embed", async () => {
		const file = await run(standalone, {
			colorMode: "dark",
			fetch: mockFetch(),
		});

		expect(String(file)).toContain('data-bluesky-embed-color-mode="dark"');
	});

	it("leaves links inside other text alone", async () => {
		const fetch = mockFetch();
		const input = `<p>Read <a href="${POST_URL}">this post</a> today</p>`;
		const file = await run(input, { fetch });

		expect(String(file)).toBe(input);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("ignores links that aren't Bluesky posts", async () => {
		const fetch = mockFetch();
		const input = `<p><a href="https://bsky.app/profile/bsky.app">profile</a></p>`;
		const file = await run(input, { fetch });

		expect(String(file)).toBe(input);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("keeps the link and warns when the post can't be fetched", async () => {
		const file = await run(standalone, {
			fetch: mockFetch(undefined, false),
		});

		expect(String(file)).toBe(standalone);
		expect(file.messages).toHaveLength(1);
		expect(file.messages[0]?.message).toContain(POST_URL);
	});

	it("keeps the link when fetch throws", async () => {
		const fetch = vi.fn(() => Promise.reject(new Error("offline")));
		const file = await run(standalone, { fetch });

		expect(String(file)).toBe(standalone);
		expect(file.messages).toHaveLength(1);
	});

	it("embeds several posts and fetches each one once", async () => {
		const fetch = mockFetch();
		const other = "https://bsky.app/profile/bsky.app/post/other";
		const input = `${standalone}<p>between</p>${standalone}<p><a href="${other}">${other}</a></p>`;
		const file = await run(input, { fetch, script: false });
		const output = String(file);

		expect(output.match(/<blockquote/g)).toHaveLength(3);
		expect(output).toContain("<p>between</p>");
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it("reuses a shared cache across files", async () => {
		const fetch = mockFetch();
		const cache = new Map();

		await run(standalone, { cache, fetch });
		await run(standalone, { cache, fetch });

		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("retries a post whose earlier fetch failed", async () => {
		const cache = new Map();
		const failing = mockFetch(undefined, false);
		const working = mockFetch();

		const first = await run(standalone, { cache, fetch: failing });
		expect(String(first)).toBe(standalone);
		expect(cache.size).toBe(0);

		const second = await run(standalone, { cache, fetch: working });
		expect(String(second)).toContain('<blockquote class="bluesky-embed"');
		expect(working).toHaveBeenCalledTimes(1);
	});

	it("retries a post whose earlier fetch threw", async () => {
		const cache = new Map();
		const throwing = vi.fn(() => Promise.reject(new Error("offline")));

		await run(standalone, { cache, fetch: throwing });
		expect(cache.size).toBe(0);
	});
});

describe("remarkBlueskyPassthrough", () => {
	// autolinks in angle brackets, which plain CommonMark links the way GFM links bare URLs
	const markdown = `Intro.\n\n<${POST_URL}>\n\nRead [this post](${POST_URL}) today.\n\n<https://www.youtube.com/watch?v=abc>\n`;

	it("hides standalone post links from paragraph-only plugins", async () => {
		// stands in for remark-oembed, which only looks at `paragraph` nodes
		const seen: string[] = [];

		await remark()
			.use(remarkBlueskyPassthrough)
			.use(collectStandaloneLinks, seen)
			.run(remark().parse(markdown));

		expect(seen).toEqual(["https://www.youtube.com/watch?v=abc"]);
	});

	it("still renders the link as a paragraph for the rehype plugin", async () => {
		const fetch = mockFetch();
		const file = await remark()
			.use(remarkBlueskyPassthrough)
			.use(remarkRehype)
			.use(plugin, { cache: new Map(), fetch, script: false })
			.use(rehypeStringify)
			.process(markdown);
		const output = String(file);

		expect(output).toContain('<blockquote class="bluesky-embed"');
		expect(output).toContain(`<a href="${POST_URL}">this post</a>`);
		expect(output.match(/<blockquote/g)).toHaveLength(1);
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
