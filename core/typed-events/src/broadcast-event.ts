import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { ValidatorMap } from "@/utils/types";

import { validate, ValidatorError } from "@/utils";

export interface TypedBroadcastEvent<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
> extends ValidatorMap<Name, Map, "event" | "message"> {
	readonly channel: BroadcastChannel;
	target: EventTarget;
}

export class TypedBroadcastEventError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastEvent", id, issues);
	}
}

export function createBroadcastEvent<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
>(name: Name, map: Map) {
	let _channel: BroadcastChannel | null = null;
	let _target: EventTarget | null = null;

	const _scopeEvent = (event: string) => [name, event].join(":");

	function _validate<
		Event extends keyof Map,
		Input extends StandardSchemaV1.InferInput<Map[Event]>,
	>(event: Event, payload: Input, callback: () => void) {
		validate({
			callback,
			data: payload,
			onerror: (issues) => {
				throw new TypedBroadcastEventError(name, issues);
			},
			schema: map[event],
			source: "TypedBroadcastEvent",
		});
	}

	return {
		get channel() {
			return (_channel ??= new BroadcastChannel(name));
		},
		dispatch(name, input) {
			_validate(name, input, () => {
				const payload = { ...input, name };
				const eventName = _scopeEvent(name);
				const event = new CustomEvent(eventName, {
					detail: payload,
				});
				this.target.dispatchEvent(event);
				this.channel.postMessage(payload);
			});
		},
		listen(name, callback) {
			const eventName = _scopeEvent(name);

			const eventListener = (event: Event) => {
				if (!(event instanceof CustomEvent)) return;
				if (event.type !== eventName) return;

				const validateCallback = () =>
					callback({ data: event.detail, raw: event, type: "event" });
				_validate(name, event.detail, validateCallback);
			};

			const channelListener = (message: MessageEvent) => {
				const { data } = message;
				if (data.name !== name) return;

				const validateCallback = () =>
					callback({ data, raw: message, type: "message" });
				_validate(name, message.data, validateCallback);
			};

			this.target.addEventListener(eventName, eventListener);
			this.channel.addEventListener("message", channelListener);
			return () => {
				this.target.removeEventListener(eventName, eventListener);
				this.channel.removeEventListener("message", channelListener);
			};
		},
		map,
		name,
		get target() {
			return (_target ??= document);
		},
		set target(target: EventTarget) {
			if (!target) {
				throw new Error(
					"tried to set TypedBroadcastEvent target to invalid target",
				);
			}

			_target = target;
		},
	} satisfies TypedBroadcastEvent<Name, Map>;
}
