import type { StandardSchemaV1 } from "@standard-schema/spec";

import { warnOnce } from "./warn";

interface ValidateIssueProps<Issues = Readonly<StandardSchemaV1.Issue[]>> {
	callback: () => void;
	issues?: Issues;
	onerror: (issues: Issues) => void;
}

interface ValidateProps<T> extends Omit<ValidateIssueProps, "issues"> {
	data: T;
	schema: StandardSchemaV1;
	source: string;
	warnOnceCondition?: boolean;
}

export function validate<T>(props: ValidateProps<T>) {
	const result = props.schema["~standard"].validate(props.data);

	const issueProps: Omit<ValidateIssueProps, "issues"> = {
		callback: props.callback,
		onerror: props.onerror,
	};

	if (!(result instanceof Promise)) {
		return validateIssues({ ...issueProps, issues: result.issues });
	}

	warnOnce({
		if:
			props.warnOnceCondition === undefined
				? process.env.NODE_ENV !== "development"
				: props.warnOnceCondition,
		message: `using async validation during ${props.source} (however this is not recommended. please use a synchronous validator)`,
	});

	result
		.then((data) => validateIssues({ ...issueProps, issues: data.issues }))
		.catch((error) => {
			console.error(error);
			throw error;
		});
}

function validateIssues({ callback, issues, onerror }: ValidateIssueProps) {
	if (issues) {
		onerror(issues);
	} else {
		callback();
	}
}
