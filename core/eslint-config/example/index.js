import { config, presets } from "../dist/index.mjs";

const loadConfig = async () =>
	await config({
		...presets.base,
	});

export default loadConfig;
