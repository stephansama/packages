import { config, presets } from "../dist/index.cjs";

const loadConfig = async () =>
	await config({
		...presets.base,
	});

export default loadConfig;
