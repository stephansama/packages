import { fromMarkdown } from "mdast-util-from-markdown";
import { expect, it } from "vitest";

import * as module from "./comment";
import { formatsSchema, languageSchema } from "./schema";

const md = String.raw;
const mockMd = md`
<!-- ZOD start -->
<!-- ZOD end -->
`;

it("loads ast comments", () => {
	const comments = module.loadAstComments(fromMarkdown(mockMd));
	for (const [index, comment] of comments.entries()) {
		expect(comment.action).toBe("ZOD");
		expect(comment.isStart).toBe(index === 0);
	}
});

it.each([
	["<!-- start -->", ""],
	["<!-- ZOD start -->", "ZOD"],
	['<!-- ZOD path="./schema.js" start -->', 'ZOD path="./schema.js"'],
])("trimComment", (input, expected) => {
	const output = module.trimComment(input);
	expect(output).toBe(expected);
});

it.each([
	["<!-- ZOD start -->", { action: "ZOD", isStart: true }],
	["<!-- ZOD end -->", { action: "ZOD", isStart: false }],
	[
		'<!-- ZOD path="./schema.js" start -->',
		{ action: "ZOD", isStart: true, parameters: [`path="./schema.js"`] },
	],
	[
		"<!-- RS-PKG-LIST start -->",
		{ action: "PKG", format: "LIST", isStart: true, language: "RS" },
	],
	[
		"<!-- JS-PKG-TABLE start -->",
		{ action: "PKG", format: "TABLE", isStart: true, language: "JS" },
	],
] as [string, module.ParsedComment][])("parseComment", (input, expected) => {
	const output = module.parseComment(input);
	if (!output) throw new Error(`failed to parse ${input}`);
	expect(output.action).toBe(expected.action);
	expect(output.format).toBe(
		// eslint-disable-next-line unicorn/no-useless-undefined
		expected.format || formatsSchema.parse(undefined),
	);
	expect(output.language).toBe(
		// eslint-disable-next-line unicorn/no-useless-undefined
		expected.language || languageSchema.parse(undefined),
	);
	expect(output.isStart).toBe(expected.isStart);
});

it.each([
	"<!-- markdownlint-disable MD013 -->",
	"<!-- markdownlint-disable MD013 MD033 MD041 -->",
	"<!-- arbitrary blog change to trigger build -->",
	"<!-- markdown-list:start -->",
	"<!-- PKG-FOO start -->",
])("skips non action comment %s without throwing", (input) => {
	expect(module.parseComment(input)).toBe(false);
});

it("keeps action comments in a readme mixed with other comments", () => {
	const comments = module.loadAstComments(
		fromMarkdown(md`
# x

<!-- markdownlint-disable MD013 -->

<!-- arbitrary text here -->

<!-- PKG start -->
<!-- PKG end -->

<!-- ZOD-TABLE start -->
<!-- ZOD-TABLE end -->
		`),
	);

	expect(comments.map((c) => [c.action, c.isStart])).toEqual([
		["PKG", true],
		["PKG", false],
		["ZOD", true],
		["ZOD", false],
	]);
});
