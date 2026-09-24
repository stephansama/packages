export interface Options {
	/**
	 * Folder, relative to the output directory, that sprites for icons
	 * registered with `getIcon` are written to
	 *
	 * @default "_iconify"
	 */
	dir?: string;
	/**
	 * Directory used to resolve `@iconify-json/*` packages
	 *
	 * @default vite's `root`
	 */
	root?: string | URL;
}
