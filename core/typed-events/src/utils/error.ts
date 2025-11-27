import type { StandardSchemaV1 } from "@standard-schema/spec";

export class ValidatorError extends Error {
	constructor(
		errorType: string,
		errorId: string,
		issues: Readonly<StandardSchemaV1.Issue[]>,
		...rest: unknown[]
	) {
		const name = `${errorType}Error`;
		const messages = [
			`${name} - ${errorId}`,
			...rest,
			JSON.stringify(issues, undefined, 2),
		];

		super(messages.join("\n"));

		this.name = name;
	}
}
