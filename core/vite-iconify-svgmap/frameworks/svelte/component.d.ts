import type { Component } from "svelte";
import type { SVGAttributes } from "svelte/elements";

export interface IconProps extends Omit<
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

/** Svg sprite icon registered through `getIcon` */
export declare const Icon: Component<IconProps>;
