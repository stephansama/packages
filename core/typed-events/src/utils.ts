export const messages = new Map<string, string>();

export function logOnce(message: string) {
	if (!messages.has(message)) {
		console.warn(message);
		messages.set(message, message);
	}
}
