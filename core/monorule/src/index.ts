import type { Rule } from "./rule";
import type { FullConfigSchema } from "./schema";

export { defineRule } from "./rule";
export { configSchema, fullConfigSchema } from "./schema";

export type { ConfigSchema, FullConfigSchema } from "./schema";
export type { DefaultRuleParseType, DirtyFile, RuleBase } from "./type";

export type UserConfig<Rules extends Rule[]> = Omit<
	FullConfigSchema,
	"rules"
> & { rules: Rules };

export function defineConfig<Rules extends Rule[]>(options: UserConfig<Rules>) {
	return options;
}
