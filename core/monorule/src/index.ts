import type { FullConfigSchema } from "./schema";

export { defineRule } from "./rule";
export { configSchema, fullConfigSchema } from "./schema";

export type { ConfigSchema, FullConfigSchema } from "./schema";
export type { DefaultRuleParseType, DirtyFile, RuleBase } from "./type";

export type UserConfig<T> = Omit<FullConfigSchema, "rules"> & {
	rules: T;
};

export function defineConfig<T>(options: UserConfig<T>) {
	return options;
}
