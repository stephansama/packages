import type { StephansamaConfig } from "./types";

export const list = [
	"javascript",
	"typescript",
	"e18e",
] as const satisfies Array<StephansamaConfig>;

export const map = new Map(
	list.map((current, index) => {
		return [current, index];
	}),
);

export type OrderType = (typeof list)[number];
