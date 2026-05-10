import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	entry: "src/index.ts",
	exports: { bin: "./src/index.ts", enabled: true },
	publint: true,
	target: "esnext",
});
