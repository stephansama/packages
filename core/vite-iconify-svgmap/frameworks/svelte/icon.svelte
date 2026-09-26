<script lang="ts">
	import type { SVGAttributes } from "svelte/elements";

	import { getIcon } from "virtual:iconify-svgmap";

	interface Props extends Omit<
		SVGAttributes<SVGSVGElement>,
		"height" | "width"
	> {
		/** Icon name inside the pack, e.g. `astro` */
		name: string;
		/** Iconify pack, e.g. `logos` for `@iconify-json/logos` */
		pack: string;
		/** Width and height of the icon @default "1em" */
		size?: number | string;
		/** Accessible label; without it the icon is hidden from assistive tech */
		title?: string;
	}

	const { name, pack, size = "1em", title, ...attributes }: Props = $props();
	const href = $derived(getIcon(pack, name));
</script>

<svg
	aria-hidden={title ? undefined : "true"}
	height={size}
	role={title ? "img" : undefined}
	width={size}
	{...attributes}
>
	{#if title}<title>{title}</title>{/if}
	<use {href}></use>
</svg>
