import type { CatppuccinColors, ColorName } from "@catppuccin/palette";

export function convertColors(colors: CatppuccinColors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce(
			(acc, [key, hex]) => {
				acc[key as keyof typeof acc] = hex;
				return acc;
			},
			{} as Record<ColorName, string>,
		);
}
