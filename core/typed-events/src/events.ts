import type { StandardSchemaV1 } from "@standard-schema/spec";

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
			step: "dispatch",
		});
	}

	listen(callback: (event: StandardEvent<Schema>) => void) {
		const listener = (e: Event) => {
			if (e instanceof CustomEvent && e.type === this.name) {
				this.#validate({
					callback: () => callback(e),
					detail: e.detail,
					step: "listen",
				});
			}
		};

		this.target.addEventListener(this.name, listener);

		return () => this.target.removeEventListener(this.name, listener);
	}

	#validate({
		callback,
		detail,
		step,
	}: {
		callback: () => void;
		detail: Detail<Schema>;
		step: keyof Pick<TypedEvent<Name, Schema>, "dispatch" | "listen">;
	}) {
		const result = this.schema["~standard"].validate(detail);

		if (!(result instanceof Promise)) {
			return this.#validateCallback(result, callback);
		}

		if (!this.#silenceWarning && process.env.NODE_ENV !== "production") {
			console.warn(
				`using async validation during TypedEvent ${step} (however this is not recommended)`,
			);
		}

		result
			.then((data) => this.#validateCallback(data, callback))
			.catch((error) => {
				console.error(error);
				throw error;
			});
	}

	#validateCallback(
		result: StandardSchemaV1.Result<unknown>,
		callback: () => void,
	) {
		if (result.issues) {
			throw new TypedEventError(result.issues);
		} else {
			callback();
		}
	}
}

export class TypedEventError extends Error {
	constructor(issues: readonly StandardSchemaV1.Issue[]) {
		super(JSON.stringify(issues, undefined, 2));
		this.name = "TypedEvent";
	}
}
