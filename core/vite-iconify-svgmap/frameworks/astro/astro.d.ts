// lets plain tsc resolve `.astro` imports; editors use @astrojs/ts-plugin
declare module "*.astro" {
	const component: (properties: Record<string, unknown>) => unknown;
	export default component;
}
