import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError } from "./utils";

type ReservedProperties = "id" | "name";

export class TypedBroadcastChannel<
	Name extends string,
	EventMap extends Record<string, StandardSchemaV1> & { name?: never },
> {
	events: EventMap;
	name: Name;

	get channel() {
		if (!this.#channel) {
			this.#channel = new BroadcastChannel(this.name);
		}
		return this.#channel;
	}

	get id() {
		if (!this.#id) this.#id = getUuid();
		return this.#id;
	}

	#channel?: BroadcastChannel;
	#id?: ReturnType<typeof getUuid>;

	constructor(name: Name, events: EventMap) {
		this.name = name;
		this.events = events;
	}

	dispatch(
		event: keyof EventMap,
		message: object & StandardSchemaV1.InferInput<EventMap[typeof event]>,
	) {
		this.#validate(event, message, () => {
			this.channel.postMessage({
				...message,
				id: this.id,
				name: event,
			});
		});
	}

	listen<
		Event extends keyof EventMap,
		Input extends StandardSchemaV1.InferInput<EventMap[Event]>,
	>(event: Event, callback: (message: MessageEvent<Input>) => void) {
		const listener = (
			message: MessageEvent<Input & Record<ReservedProperties, string>>,
		) => {
			if (message.data.name === event && message.data.id !== this.id) {
				this.#validate(event, message.data, () => {
					callback(message);
				});
			}
		};
		this.channel.addEventListener("message", listener);
		return () => this.channel.removeEventListener("message", listener);
	}

	#validate<Event extends keyof EventMap>(
		event: Event,
		message: StandardSchemaV1.InferInput<EventMap[Event]>,
		callback: () => void,
	) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedBroadcastChannelError(this.id, issues);
			},
			schema: this.events[event],
		});
	}
}

export class TypedBroadcastChannelError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastChannel", id, issues);
	}
}

function getUuid() {
	return globalThis.crypto.randomUUID();
}
