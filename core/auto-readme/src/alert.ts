import type { Root } from "mdast";
import type { Plugin } from "unified";

const ALERT_REGEX = /^\[!(?:CAUTION|IMPORTANT|NOTE|TIP|WARNING)\]/;

/**
 * Keep github alert markers (`> [!NOTE]`) intact. remark escapes the leading
 * `[` when stringifying, which renders as a plain blockquote on github, so the
 * marker is moved into an `html` node that is written out verbatim
 */
export const remarkGithubAlert: Plugin<[], Root> = () => unescapeAlerts;

function unescapeAlerts(tree: Root) {
	for (const node of tree.children) {
		if (node.type !== "blockquote") continue;

		const paragraph = node.children[0];
		if (paragraph?.type !== "paragraph") continue;

		const text = paragraph.children[0];
		if (text?.type !== "text") continue;

		const marker = ALERT_REGEX.exec(text.value)?.[0];
		if (!marker) continue;

		const rest = text.value.slice(marker.length);
		paragraph.children.splice(
			0,
			1,
			{ type: "html", value: marker },
			...(rest ? [{ type: "text" as const, value: rest }] : []),
		);
	}
}
