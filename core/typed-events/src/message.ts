import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError } from "./utils";

type TypedMessageEvent = Record<"id", string>;

export class TypedMessage<
	Scope extends string,
	EventMap extends Record<string, StandardSchemaV1> & { name?: never },
> {
	events: EventMap;
	scope: Scope;

	get window() {
		if (!this.#window) this.#window = window;
		return this.#window;
	}

	set window(window: Window) {
		if (!window) {
			throw new Error(
				`unable to set TypedMessage window to an invalid window - ${window}`,
			);
		}

		this.#window = window;
	}

	#window?: Window;

	constructor(scope: Scope, events: EventMap) {
		this.scope = scope;
		this.events = events;
	}

	dispatch<Event extends keyof EventMap & string>(
		name: Event,
		message: object & StandardSchemaV1.InferInput<EventMap[Event]>,
		target?: { origin: string; window: Window },
	) {
		this.#validate(name, message, () => {
			const id = this.#scopeName(name);
			const data: TypedMessageEvent = { ...message, id };

			if (!target) {
				return this.window.postMessage(data, this.window.origin);
			}

			target.window.postMessage(data, target.origin);
		});
	}

	listen<
		Event extends keyof EventMap & string,
		Input extends StandardSchemaV1.InferInput<EventMap[Event]> &
			TypedMessageEvent,
	>(
		name: Event,
		callback: (payload: {
			data: Input;
			message: MessageEvent<Input>;
		}) => void,
	) {
		const listener = (message: MessageEvent<Input>) => {
			if (message.data.id !== this.#scopeName(name)) return;

			this.#validate(name, message.data, () => {
				callback({ data: message.data, message });
			});
		};
		this.window.addEventListener("message", listener);
		return () => this.window.removeEventListener("message", listener);
	}

	#scopeName(name: string) {
		return [this.scope, name].join(":");
	}

	#validate<EventName extends keyof EventMap>(
		name: EventName,
		message: StandardSchemaV1.InferInput<EventMap[EventName]>,
		callback: () => void,
	) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedMessageError(this.scope, issues);
			},
			schema: this.events[name],
			source: "TypedMessage",
		});
	}
}

export class TypedMessageError extends ValidatorError {
	constructor(scope: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedMessageError", scope, issues);
	}
}
