export interface Options {
	/**
	 * Ordered list of breakpoints. Defaults to tailwind css's built in screens
	 * (`sm`, `md`, `lg`, `xl`, `2xl`).
	 */
	screens?: Screens;
}

/**
 * Tailwind style breakpoint list: each entry becomes a `(min-width: <value>)`
 * media query. Entries must be sorted ascending. `value` accepts any css length
 * (`"640px"`, `"40rem"`, ...).
 */
export type Screens = Array<{ name: string; value: string }>;
