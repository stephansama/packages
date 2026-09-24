declare module "virtual:iconify-svgmap" {
	/**
	 * Register an icon while rendering and return its sprite href, e.g.
	 * `/_iconify/<pack>.svg?v=<build>#<name>`
	 */
	export function getIcon(pack: string, name: string): string;
}

declare module "virtual:iconify-svgmap/*" {
	/**
	 * Sprite href for the imported icon, e.g.
	 * `/_astro/<pack>-<hash>.svg#<icon>`
	 */
	const href: string;
	export default href;
}
