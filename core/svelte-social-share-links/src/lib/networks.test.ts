import { expect, it } from "vitest";

import * as module from "./networks";
import * as networks from "./networks.json";

it.each<[module.Network, module.UrlProps, string]>([
	[
		"bluesky",
		{
			url: "https://stephansama.info",
		},
		"https://bsky.app/intent/compose?text=https%3A%2F%2Fstephansama.info",
	],
	[
		"reddit",
		{
			url: "https://stephansama.info",
		},
		"https://www.reddit.com/submit?url=https%3A%2F%2Fstephansama.info",
	],
])("first", (key, props, expected) => {
	expect(module.buildUrl(networks[key], props)).toBe(expected);
});
