import { act as generateAct, meta as generateMeta } from "./generate";

export const commands = [generateMeta];

export const actions = {
	[generateMeta.options.name]: generateAct,
};
