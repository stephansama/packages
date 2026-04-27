import { visit, type Visitor } from "unist-util-visit";

import * as utilities from "./utilities";

export type RemarkAsciinemaEmbedOption = "image" | "script";

export interface RemarkAsciinemaOptions {
	embedType: RemarkAsciinemaEmbedOption;
}

export default function asciinema(inputOptions: RemarkAsciinemaOptions) {
	const { embedType = "script" } = inputOptions;
	const transform =
		embedType === "script"
			? utilities.constructAsciinemaScript
			: utilities.constructAsciinemaImage;

	return function transformer(tree: Parameters<typeof visit>[0]) {
		visit(
			tree,
			"link",
			(
				node: Parameters<Visitor>[0] & { url: string },
				index: Parameters<Visitor>[1],
				parent: Parameters<Visitor>[2],
			) => {
				const asciinemaURL = utilities.getURL(node?.url, (url) =>
					url.host.includes("asciinema.org"),
				);

				if (!asciinemaURL) return;

				// replace the node in place
				parent?.children.splice(index!, 1, {
					type: "html",
					value: transform(asciinemaURL.toString()),
				} as (typeof parent)["children"][number] & { value: string });
			},
		);
	};
}
