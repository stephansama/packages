import type { PageLoad } from "./$types";

// pretend these come from a cms and are only known while rendering
export const load: PageLoad = () => ({
	icons: [
		["logos", "azure-icon"],
		["logos", "alpinejs"],
		["heroicons", "newspaper-solid"],
	] as const,
});
