import { visit, type Visitor } from "unist-util-visit";

import { constructLiteYoutube, extractYoutubeId } from "./utilities";

export interface RemarkLiteYoutubeOptions {
	/** Optional default `playlabel` when the markdown link has no text. */
	defaultPlayLabel?: string;
}

export default function liteYoutube(options?: RemarkLiteYoutubeOptions) {
	const fallbackLabel = options?.defaultPlayLabel ?? "Play";

	return function transformer(tree: Parameters<typeof visit>[0]) {
		visit(
			tree,
			"link",
			(
				node: Parameters<Visitor>[0] & {
					children?: { type: string; value?: string }[];
					url: string;
				},
				index: Parameters<Visitor>[1],
				parent: Parameters<Visitor>[2],
			) => {
				const videoId = extractYoutubeId(node.url);
				if (!videoId) return;

				const linkText = node.children
					?.filter((child) => child.type === "text")
					.map((child) => child.value ?? "")
					.join("")
					.trim();

				const playLabel = linkText || fallbackLabel;

				parent?.children.splice(index!, 1, {
					type: "html",
					value: constructLiteYoutube(videoId, playLabel),
				} as (typeof parent)["children"][number] & { value: string });
			},
		);
	};
}
