import { visit, type Visitor } from "unist-util-visit";
import {
	constructAsciinemaImage,
	constructAsciinemaScript,
	getURL,
} from "./utils";

export type RemarkAsciinemaEmbedOption = "image" | "script";

export interface RemarkAsciinemaOptions {
	embedType: RemarkAsciinemaEmbedOption;
}

export default function asciinema(
	options: RemarkAsciinemaOptions = { embedType: "script" },
) {
	const transform =
		options.embedType === "script"
			? constructAsciinemaScript
			: constructAsciinemaImage;

	return function transformer(tree: Parameters<typeof visit>[0]) {
		visit(
			tree,
			"link",
			(
				node: Parameters<Visitor>[0] & { url: string },
				index: Parameters<Visitor>[1],
				parent: Parameters<Visitor>[2],
			) => {
				const asciinemaURL = getURL(node?.url, (url) =>
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
