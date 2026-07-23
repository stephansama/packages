import type { CliArguments } from "./arguments";

type AllKeys<T> = T extends unknown ? keyof T : never;
type Flags = CliArguments["flags"];

// keep only the union members that have K, then index those
type FlagValue<K extends AllKeys<Flags>> = Extract<
	Flags,
	Record<K, unknown>
>[K];

export function getFlag<Flag extends AllKeys<Flags>>(
	input: CliArguments,
	flag: Flag,
): FlagValue<Flag> | undefined {
	return (input.flags as Record<PropertyKey, unknown>)[flag] as
		| FlagValue<Flag>
		| undefined;
}
