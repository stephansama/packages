// https://github.com/Rokt33r/remark-collapse
declare module "remark-collapse" {
	import type { Heading, Root } from "mdast";
	import type { Plugin } from "unified";

	export type CollapseOptions = {
		summary?: string | undefined;
		test?:
			| TestOption
			| undefined
			| {
					ignoreFinalDefinitions: boolean;
					test: TestOption;
			  };
	};

	export type TestOption =
		| ((value: string, node: Heading) => boolean)
		| RegExp
		| string;

	declare const collapse: Plugin<[CollapseOptions], Root>;

	export default collapse;
}

// https://github.com/kevin940726/remark-code-import
declare module "remark-code-import" {
	import type { Root } from "mdast";

	interface CodeImportOptions {
		allowImportingFromOutside?: boolean;
		async?: boolean;
		preserveTrailingNewline?: boolean;
		removeRedundantIndentations?: boolean;
		rootDir?: string;
	}

	declare function codeImport(
		options?: CodeImportOptions,
	): Plugin<[CodeImportOptions], Root>;

	export { codeImport };
	export default codeImport;
}
