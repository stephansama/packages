import type { Root } from "mdast";
import type { Plugin } from "unified";

import { zone } from "mdast-zone";

export const myPluginThatReplacesFoo: Plugin<[], Root> = () => {
	return function (tree) {
		zone(tree, "PKG", function (start, nodes, end) {
			return [
				start,
				{
					children: [{ type: "text", value: "Bar." }],
					type: "paragraph",
				},
				end,
			];
		});
	};
};
