import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { ValidatorMap } from "@/utils";

import { validate, ValidatorError } from "@/utils";

export interface TypedBroadcastChannel<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
> extends ValidatorMap<Name, Map, "message"> {
	readonly channel: BroadcastChannel;
}

export class TypedBroadcastChannelError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastChannel", id, issues);
	}
}

export function createBroadcastChannel<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
>(name: Name, map: Map) {
	let _channel: BroadcastChannel | null = null;

	function _validate<
		Event extends keyof Map,
		Input extends StandardSchemaV1.InferInput<Map[Event]>,
	>(event: Event, message: Input, callback: () => void) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedBroadcastChannelError(name, issues);
			},
			schema: map[event],
			source: "TypedBroadcastChannel",
		});
	}

	return {
		get channel() {
			return (_channel ??= new BroadcastChannel(name));
		},
		dispatch(name, input) {
			_validate(name, input, () => {
				this.channel.postMessage({ ...input, name });
			});
		},
		listen(name, callback) {
			const listener = (message: MessageEvent) => {
				const { data } = message;
				if (data.name !== name) return;

				_validate(name, data, () => {
					callback({ data, raw: message, type: "message" });
				});
			};
			this.channel.addEventListener("message", listener);
			return () => this.channel.removeEventListener("message", listener);
		},
		map,
		name,
	} satisfies TypedBroadcastChannel<Name, Map>;
}
