import { config, presets } from "../dist/index.mjs";

export default await config({
	...presets.base,
});
