import type { StandardSchemaV1 } from "@standard-schema/spec";

import { Id, validate, ValidatorError, ValidatorMap } from "./utils";

export class TypedBroadcastChannelError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastChannel", id, issues);
	}
}

export function createTypedBroadcastChannel<
	Map extends Record<string, StandardSchemaV1>,
>(name: string, map: Map) {
	let _id: Id | null = null;
	let _channel: BroadcastChannel | null = null;

	function _validate<
		Event extends keyof Map,
		Input extends StandardSchemaV1.InferInput<Map[Event]>,
	>(event: Event, message: Input, callback: () => void) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedBroadcastChannelError(String(_id), issues);
			},
			schema: map[event],
			source: "TypedBroadcastChannel",
		});
	}

	return {
		get channel() {
			if (!_channel) _channel = new BroadcastChannel(name);
			return _channel;
		},
		dispatch(name, input) {
			_validate(name, input, () => {
				this.channel.postMessage({ ...input, id: this.id, name });
			});
		},
		get id() {
			if (!_id) _id = crypto.randomUUID();
			return _id;
		},
		listen(name, callback) {
			const listener = (message: MessageEvent) => {
				if (message.data.name !== name) return;

				_validate(name, message.data, () => {
					callback({
						data: message.data,
						raw: message,
						type: "message",
					});
				});
			};
			this.channel.addEventListener("message", listener);
			return () => this.channel.removeEventListener("message", listener);
		},
		map,
		name,
	} satisfies ValidatorMap<Map> & { channel: BroadcastChannel; id: Id };
}
