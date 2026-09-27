import tailwindDebugScreens from "@stephansama/vite-devtools-tailwind-debug-screens";
import { defineConfig } from "vite";

export default defineConfig({
	devtools: true,
	plugins: [tailwindDebugScreens()],
});
