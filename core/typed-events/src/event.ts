import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError } from "@/utils";

type Detail<T extends StandardSchemaV1> = StandardSchemaV1.InferInput<T>;
type Restrict<T extends string, Forbidden> = T extends Forbidden ? never : T;
type StandardEvent<T extends StandardSchemaV1> = CustomEvent<Detail<T>>;

export class TypedEvent<
	Name extends string,
	Schema extends StandardSchemaV1,
	ForbiddenEvents = keyof DocumentEventMap,
> {
	name: Name;
	schema: Schema;

	get target() {
		return this.#target || document;
	}

	set target(target: EventTarget) {
		if (!target) {
			console.error("tried to set TypedEvent target to invalid target");
			return;
		}

		this.#target = target;
	}

	#silenceWarning: boolean;
	#target?: EventTarget;

	constructor(
		name: Restrict<Name, ForbiddenEvents>,
		schema: Schema,
		opts: { silenceAsyncWarning?: boolean; target?: EventTarget } = {},
	) {
		this.name = name;
		this.schema = schema;

		this.#silenceWarning = !!opts.silenceAsyncWarning;

		if (opts.target) this.#target = opts.target;
	}

	dispatch(detail: Detail<Schema>) {
		const callback = () => {
			const event = new CustomEvent<Detail<Schema>>(this.name, {
				detail,
			});

			this.target.dispatchEvent(event);
		};

		this.#validate({
			callback,
			detail,
		});
	}

	listen(callback: (event: StandardEvent<Schema>) => void) {
		const listener = (e: Event) => {
			if (e instanceof CustomEvent && e.type === this.name) {
				this.#validate({
					callback: () => callback(e),
					detail: e.detail,
				});
			}
		};

		this.target.addEventListener(this.name, listener);
		return () => this.target.removeEventListener(this.name, listener);
	}

	#validate({
		callback,
		detail,
	}: {
		callback: () => void;
		detail: Detail<Schema>;
	}) {
		validate({
			callback,
			data: detail,
			onerror: (issues) => {
				throw new TypedEventError(this.name, issues);
			},
			schema: this.schema,
			source: "TypedEvent",
			warnOnceCondition: this.#silenceWarning,
		});
	}
}

export class TypedEventError extends ValidatorError {
	constructor(eventName: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedEvent", eventName, issues);
	}
}
