import type { StandardSchemaV1 } from "@standard-schema/spec";

export type InferEventDetail<E> =
	E extends ReturnType<typeof createEvent>
		? StandardSchemaV1.InferInput<E["schema"]>
		: never;

export function createEvent<S extends string, T extends StandardSchemaV1>(
	name: S,
	schema: T,
	target: EventTarget = document,
) {
	type Detail = StandardSchemaV1.InferInput<T>;

	return {
		dispatch(detail: Detail) {
			this.validate(detail);

			const event = new CustomEvent<Detail>(name, { detail });

			target.dispatchEvent(event);
		},
		listen(callback: (event: CustomEvent<Detail>) => void) {
			const validate = this.validate;

			function listener(e: Event) {
				if (e instanceof CustomEvent && e.type === name) {
					validate(e.detail);

					callback(e);
				}
			}

			target.addEventListener(name, listener);

			return () => target.removeEventListener(name, listener);
		},
		name,
		schema,
		validate(detail: Detail) {
			const result = schema["~standard"].validate(detail);

			if (result instanceof Promise) {
				throw new Error("async validation not supported");
			}

			if (result.issues) {
				throw new Error(JSON.stringify(result.issues, null, 2));
			}
		},
	};
}
