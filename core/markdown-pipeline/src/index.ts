import type { PluggableList } from "unified";

import { remark } from "remark";

/**
 * Shape of the shared options object consumers pass when building a pipeline or
 * asking for an Astro-style preset. In this v0.1 the package is a thin
 * orchestrator: callers supply the plugin functions they already depend on, and
 * the helpers below produce a single combined `PluggableList` (or full
 * processor). A follow-up iteration will bundle commonly-used plugins behind
 * the reserved boolean flags once they live in the workspace catalog.
 */
export interface PipelineOptions {
	/**
	 * Reserved — wired when `remark-github-blockquote-alert` lands in catalog
	 * (STE-181).
	 */
	admonitions?: boolean;
	/** Reserved — wired when `rehype-external-links` lands in catalog. */
	externalLinks?: boolean;
	/** Reserved — wired in a follow-up once `remark-gfm` is catalogued. */
	gfm?: boolean;
	/** Rehype-stage plugin tuples or functions to apply, in order. */
	rehypePlugins?: PluggableList;
	/** Remark-stage plugin tuples or functions to apply, in order. */
	remarkPlugins?: PluggableList;
	/** Reserved — wired in a follow-up once `@shikijs/rehype` is catalogued. */
	shiki?: boolean;
	/**
	 * Reserved — wired when `rehype-slug` + `rehype-autolink-headings` land in
	 * catalog.
	 */
	slugs?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProcessorLike = any;

/**
 * Build a unified processor from `remark()` and apply the configured plugins.
 * Return type is intentionally `unknown` so callers don't transitively depend
 * on `@types/mdast`; cast to the unified `Processor` you need at the call
 * site.
 */
export function createPipeline(options: PipelineOptions = {}): unknown {
	const plugins = [
		...(options.remarkPlugins ?? []),
		...(options.rehypePlugins ?? []),
	];
	let processor: ProcessorLike = remark();
	for (const plugin of plugins) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		processor = applyPlugin(processor, plugin);
	}
	return processor;
}

/**
 * Spreadable list of rehype plugins suitable for Astro
 * `markdown.rehypePlugins`.
 */
export function rehypePreset(options: PipelineOptions = {}): PluggableList {
	return options.rehypePlugins ?? [];
}

/**
 * Spreadable list of remark plugins suitable for Astro
 * `markdown.remarkPlugins`.
 */
export function remarkPreset(options: PipelineOptions = {}): PluggableList {
	return options.remarkPlugins ?? [];
}

function applyPlugin(
	processor: ProcessorLike,
	plugin: PluggableList[number],
): ProcessorLike {
	/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
	if (Array.isArray(plugin)) {
		const [callable, ...rest] = plugin as [unknown, ...unknown[]];
		return processor.use(callable, ...rest);
	}
	return processor.use(plugin);
	/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
}
