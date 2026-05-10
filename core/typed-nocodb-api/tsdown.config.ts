import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: ["src/index.ts"],
	exports: true,
	format: "esm",
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
