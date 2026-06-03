import type { FullConfigSchema } from "./schema";

export { parsers, stringifiers } from "./parse";
export { DEFAULT_IGNORE_LIST } from "./paths";
export { defineRule, loadRules } from "./rules";
export { configSchema, fullConfigSchema } from "./schema";

export type { ConfigSchema, FullConfigSchema } from "./schema";
export type { DefaultRuleParseType, DirtyFile, Error, RuleBase } from "./type";

export type UserConfig<T> = Omit<FullConfigSchema, "rules"> & {
	rules: T;
};

export function defineConfig<T>(options: UserConfig<T>) {
	return options;
}
