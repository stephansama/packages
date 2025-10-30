const alreadyWarned: { [message: string]: boolean } = {};

export function warnOnce({
	if: condition,
	message,
}: {
	if: boolean;
	message: string;
}): void {
	if (!condition && !alreadyWarned[message]) {
		alreadyWarned[message] = true;
		console.warn(message);
	}
}
