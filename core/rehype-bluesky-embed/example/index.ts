import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import blueskyEmbed from "../dist/index.mjs";

export async function pipeline() {
	const file = await unified()
		.use(rehypeParse, { fragment: true })
		.use(blueskyEmbed, { colorMode: "dark", script: false })
		.use(rehypeStringify)
		.process(
			'<p><a href="https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l">https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l</a></p>',
		);

	console.info(String(file));
}
