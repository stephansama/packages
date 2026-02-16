import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "node16" },
	dts: true,
	entry: ["src/index.ts", "src/errors.ts", "src/react.ts"],
	exports: true,
	format: ["esm", "cjs"],
	noExternal: ["nanoid"],
	publint: true,
	target: "esnext",
});
