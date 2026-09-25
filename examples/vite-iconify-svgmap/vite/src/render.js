import { getIcon } from "virtual:iconify-svgmap";

// pretend these come from a cms and are only known while rendering
const icons = [
	["logos", "azure-icon"],
	["logos", "alpinejs"],
	["heroicons", "newspaper-solid"],
];

export function render() {
	return icons
		.map(([pack, name]) => getIcon(pack, name))
		.map((href) => `<svg><use href="${href}"></use></svg>`)
		.join("");
}
