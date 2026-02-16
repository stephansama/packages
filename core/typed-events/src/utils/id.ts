import { nanoid } from "nanoid";

export type Id = ReturnType<typeof createId>;

export function createId() {
	return nanoid();
}
