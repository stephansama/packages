import { remark } from "remark";
import { expect, it } from "vitest";

import { remarkGithubAlert } from "./alert";

async function process(input: string) {
	return String(await remark().use(remarkGithubAlert).process(input));
}

it.each(["CAUTION", "IMPORTANT", "NOTE", "TIP", "WARNING"])(
	"keeps the %s alert marker unescaped",
	async (type) => {
		const input = `> [!${type}]\n> some text\n`;
		expect(await process(input)).toBe(input);
	},
);

it("repairs an alert marker that was already escaped", async () => {
	expect(await process("> \\[!NOTE]\n> some text\n")).toBe(
		"> [!NOTE]\n> some text\n",
	);
});

it("still escapes brackets that are not alert markers", async () => {
	expect(await process("> [!UNKNOWN] text\n")).toBe("> \\[!UNKNOWN] text\n");
	expect(await process("[!NOTE] outside a blockquote\n")).toBe(
		"\\[!NOTE] outside a blockquote\n",
	);
});
