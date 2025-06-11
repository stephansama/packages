import deepmerge from "deepmerge";

/**
 * @param {import('prettier').Config[]} configs - Prettier configs to merge
 */
export function merge(...configs) {
	return deepmerge.all(configs);
}
