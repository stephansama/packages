import type { defineRule } from "./define";

export type Rule = ReturnType<typeof defineRule>;
export type RuleMap = Record<string, Rule>;
