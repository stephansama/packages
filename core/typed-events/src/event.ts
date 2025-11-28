import type { StandardSchemaV1 } from "@standard-schema/spec";

import { type Restrict, validate, ValidatorError } from "@/utils";

export class TypedEventError extends ValidatorError {
	constructor(eventName: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedEvent", eventName, issues);
	}
}

export function createEvent<Schema extends StandardSchemaV1>(
	name: Restrict<string, keyof DocumentEventMap>,
	schema: Schema,
	opts: { silenceAsyncWarning?: boolean; target?: EventTarget } = {},
) {
	type Detail = StandardSchemaV1.InferInput<Schema>;
	let _target: EventTarget | null = opts?.target || null;

	function _validate(callback: () => void, detail: Detail) {
		validate({
			callback,
			data: detail,
			onerror: (issues) => {
				throw new TypedEventError(name, issues);
			},
			schema,
			source: "TypedEvent",
			warnOnceCondition: !!opts.silenceAsyncWarning,
		});
	}

	return {
		dispatch(detail: Detail) {
			const callback = () => {
				const event = new CustomEvent<Detail>(name, { detail });
				this.target.dispatchEvent(event);
			};

			_validate(callback, detail);
		},
		listen(callback: (event: CustomEvent<Detail>) => void) {
			const listener = (e: Event) => {
				if (e instanceof CustomEvent && e.type === name) {
					_validate(() => callback(e), e.detail);
				}
			};

			this.target.addEventListener(name, listener);
			return () => this.target.removeEventListener(name, listener);
		},
		name,
		get target() {
			return (_target ??= document);
		},
		set target(target: EventTarget) {
			if (!target) {
				throw new Error(
					"tried to set TypedEvent target to invalid target",
				);
			}

			_target = target;
		},
	};
}
