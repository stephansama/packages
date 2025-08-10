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
	for (let i = 0; i < comments.length; i++) {
		expect(comments[i].action).toBe("ZOD");
		expect(comments[i].isStart).toBe(i === 0);
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
] as [string, ReturnType<typeof module.parseComment>][])(
	"parseComment",
	(input, expected) => {
		const output = module.parseComment(input);
		expect(output.action).toBe(expected.action);
		expect(output.format).toBe(
			expected.format || formatsSchema.parse(undefined),
		);
		expect(output.language).toBe(
			expected.language || languageSchema.parse(undefined),
		);
		expect(output.isStart).toBe(expected.isStart);
	},
);
