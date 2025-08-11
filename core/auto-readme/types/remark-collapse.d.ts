// https://github.com/Rokt33r/remark-collapse
declare module "remark-collapse" {
	import type { Root } from "mdast";
	import type { Plugin } from "unified";

	export type CollapseOptions = {
		summary?: string | undefined;
		test?: string | undefined;
	};

	declare const collapse: Plugin<[CollapseOptions], Root>;

	export default collapse;
}
