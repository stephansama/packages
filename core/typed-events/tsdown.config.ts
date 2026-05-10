import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "node16" },
	dts: true,
	entry: ["src/index.ts", "src/errors.ts", "src/react.ts"],
	exports: true,
	format: ["esm", "cjs"],
	noExternal: ["nanoid"],
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
