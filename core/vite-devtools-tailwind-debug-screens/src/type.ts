export interface Options {
	/**
	 * Path to a tailwind config or css theme file to read breakpoints from.
	 * Resolved against vite's `root`. Ignored if `screens` is set.
	 *
	 * Supported shapes:
	 *
	 * - `.css` files are scanned for `@theme` blocks / any `--breakpoint-*:
	 *   <value>;` declarations (tailwind v4)
	 * - `.js` / `.mjs` / `.cjs` / `.ts` files are dynamic-imported; the default
	 *   export's `theme.screens` (merged with `theme.extend.screens`) is used
	 *   (tailwind v3, or v4 with the `@config` directive)
	 *
	 * If loading fails a warning is logged and the plugin falls back to
	 * tailwind's default screens.
	 */
	configFile?: string;
	/**
	 * Ordered list of breakpoints. Wins over `configFile`. Defaults to tailwind
	 * css's built in screens (`sm`, `md`, `lg`, `xl`, `2xl`).
	 */
	screens?: Screens;
}

/**
 * Tailwind style breakpoint list: each entry becomes a `(min-width: <value>)`
 * media query. Entries must be sorted ascending. `value` accepts any css length
 * (`"640px"`, `"40rem"`, ...).
 */
export type Screens = Array<{ name: string; value: string }>;
