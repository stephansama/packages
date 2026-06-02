import { act as generateAct, meta as generateMeta } from "./generate";
import { act as listAct, meta as listMeta } from "./list";

export const commands = [generateMeta, listMeta];

export const actions = {
	[generateMeta.options.name]: generateAct,
	[listMeta.options.name]: listAct,
};
