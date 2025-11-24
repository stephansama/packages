import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError } from "./utils";

type ReservedProperties = "id" | "name";

export class TypedBroadcastEvent<
	Scope extends string,
	EventMap extends Record<string, StandardSchemaV1> & { name?: never },
> {
	events: EventMap;
	scope: Scope;

	get channel() {
		if (!this.#channel) {
			this.#channel = new BroadcastChannel(this.scope);
		}
		return this.#channel;
	}

	get id() {
		if (!this.#id) this.#id = crypto.randomUUID();
		return this.#id;
	}

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

	#channel?: BroadcastChannel;
	#id?: ReturnType<typeof crypto.randomUUID>;
	#target?: EventTarget;

	constructor(scope: Scope, events: EventMap) {
		this.scope = scope;
		this.events = events;
	}

	dispatch<
		EventName extends keyof EventMap & string,
		Input extends StandardSchemaV1.InferInput<EventMap[EventName]>,
	>(name: EventName, input: Input & object) {
		this.#validate(name, input, () => {
			const payload = { ...input, id: this.id, name };
			const event = new CustomEvent<Input>(this.#scopeEvent(name), {
				detail: payload,
			});
			this.target.dispatchEvent(event);
			this.channel.postMessage(payload);
		});
	}

	getPayload<
		EventName extends keyof EventMap & string,
		Input extends Record<ReservedProperties, string> &
			StandardSchemaV1.InferInput<EventMap[EventName]>,
	>(event: CustomEvent<Input> | MessageEvent<Input>) {
		if (event instanceof CustomEvent) {
			return event.detail;
		}

		if (event instanceof MessageEvent) {
			return event.data;
		}

		throw new Error("failed to parse payload");
	}

	listen<
		EventName extends keyof EventMap & string,
		Input extends Record<ReservedProperties, string> &
			StandardSchemaV1.InferInput<EventMap[EventName]>,
	>(
		name: EventName,
		callback: (event: CustomEvent<Input> | MessageEvent<Input>) => void,
	) {
		const eventName = this.#scopeEvent(name);

		const eventListener = (event: Event) => {
			if (event instanceof CustomEvent && event.type === eventName) {
				const validateCallback = () => callback(event);
				this.#validate(name, event.detail, validateCallback);
			}
		};

		const channelListener = (message: MessageEvent<Input>) => {
			if (message.data.name === name && message.data.id !== this.id) {
				const validateCallback = () => callback(message);
				this.#validate(name, message.data, validateCallback);
			}
		};

		this.target.addEventListener(eventName, eventListener);
		this.channel.addEventListener("message", channelListener);

		return () => {
			this.target.removeEventListener(eventName, eventListener);
			this.channel.removeEventListener("message", channelListener);
		};
	}

	#scopeEvent(event: string) {
		return [this.scope, event].join(":");
	}

	#validate<
		Event extends keyof EventMap,
		Input extends StandardSchemaV1.InferInput<EventMap[Event]>,
	>(event: Event, payload: Input, callback: () => void) {
		validate({
			callback,
			data: payload,
			onerror: (issues) => {
				throw new TypedBroadcastEventError(this.id, issues);
			},
			schema: this.events[event],
			source: "TypedBroadcastEvent",
		});
	}
}

export class TypedBroadcastEventError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastEvent", id, issues);
	}
}
