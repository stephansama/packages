import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	entry: "src/index.ts",
	exports: { bin: true, enabled: true },
	publint: true,
	target: "esnext",
});
