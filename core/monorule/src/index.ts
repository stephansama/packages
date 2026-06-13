import type { FullConfigSchema } from "./schema";

export { parse, parsers, stringifiers, stringify } from "./parse";
export { DEFAULT_IGNORE_LIST } from "./paths";
export { defineRule, loadRules } from "./rules";
export { configSchema, fullConfigSchema } from "./schema";

export type {
	BuiltinParseEnumSchema,
	ConfigSchema,
	FullConfigSchema,
} from "./schema";
export type { DirtyFile, Error, ErrorId, ErrorValue, RuleBase } from "./type";

export type UserConfig<T> = Omit<FullConfigSchema, "rules"> & {
	rules: T;
};

export function defineConfig<T>(options: UserConfig<T>) {
	return options;
}
