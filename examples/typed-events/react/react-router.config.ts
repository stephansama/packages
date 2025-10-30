import type { Config } from "@react-router/dev/config";

export default {
	buildDirectory: "./dist",
	future: { unstable_optimizeDeps: true },
	ssr: true,
} satisfies Config;
