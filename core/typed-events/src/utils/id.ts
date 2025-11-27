export type Id = ReturnType<typeof createId>;

export function createId() {
	return crypto.randomUUID();
}
