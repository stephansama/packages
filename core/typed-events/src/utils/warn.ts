const alreadyWarned: Record<string, boolean> = {};

export function warnOnce({
	if: condition,
	message,
}: {
	if: boolean;
	message: string;
}) {
	if (!condition && !alreadyWarned[message]) {
		alreadyWarned[message] = true;
		console.warn(message);
	}
}
