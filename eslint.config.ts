import { presets, stephansama } from "@stephansama/eslint-config";

export default stephansama({
	...presets.base,
	...presets.library,
	...presets.pnpm,
});
