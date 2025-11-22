import type { StandardSchemaV1 } from "@standard-schema/spec";

const alreadyWarned: { [message: string]: boolean } = {};

type Issues = NonNullable<StandardSchemaV1.Result<unknown>["issues"]>;

export class ValidatorError extends Error {
	constructor(
		errorType: string,
		errorId: string,
		issues: readonly StandardSchemaV1.Issue[],
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

export function validate({
	callback,
	data,
	onerror,
	schema,
	source,
	warnOnceCondition = process.env.NODE_ENV === "production",
}: {
	callback: () => void;
	data: unknown;
	onerror: (issues: Issues) => void;
	schema: StandardSchemaV1;
	source: string;
	warnOnceCondition?: boolean;
}) {
	const result = schema["~standard"].validate(data);

	if (!(result instanceof Promise)) {
		return validateIssues(result.issues!, callback, onerror);
	}

	warnOnce({
		if: warnOnceCondition,
		message: `using async validation during ${source} (however this is not recommended. please use a synchronous validator)`,
	});

	result
		.then((data) => validateIssues(data.issues!, callback, onerror))
		.catch((error) => {
			console.error(error);
			throw error;
		});
}

export function validateIssues(
	issues: Issues,
	callback: () => void,
	onerror: (issues: Issues) => void,
) {
	if (issues) {
		onerror(issues);
	} else {
		callback();
	}
}

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
