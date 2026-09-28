export interface Options {
	/**
	 * Path to a tailwind config or css theme file to read breakpoints from.
	 * Resolved against vite's `root`. Ignored if `screens` is set.
	 *
	 * Supported shapes:
	 *
	 * - `.css` files are scanned for `@theme` blocks / any `--breakpoint-*:
	 *   <value>;` declarations (tailwind v4). Declarations layer over
	 *   tailwind's default screens; `--breakpoint-*: initial` clears them and
	 *   `--breakpoint-<name>: initial` removes a single one
	 * - `.js` / `.mjs` / `.cjs` / `.ts` files are dynamic-imported (tailwind v3,
	 *   or v4 with the `@config` directive). `theme.screens` replaces
	 *   tailwind's default screens and `theme.extend.screens` is added on top
	 *   of whichever base is in effect
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
