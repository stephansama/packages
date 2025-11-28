import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { Id, ValidatorMap } from "@/utils";

import { validate, ValidatorError } from "@/utils";

export class TypedBroadcastChannelError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedBroadcastChannel", id, issues);
	}
}

export function createBroadcastChannel<
	Map extends Record<string, StandardSchemaV1>,
>(name: string, map: Map) {
	let _id: Id | null = null;
	let _channel: BroadcastChannel | null = null;

	const getId = () => (_id ??= crypto.randomUUID());

	function _validate<
		Event extends keyof Map,
		Input extends StandardSchemaV1.InferInput<Map[Event]>,
	>(event: Event, message: Input, callback: () => void) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedBroadcastChannelError(String(getId()), issues);
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
				this.channel.postMessage({ ...input, id: this.id, name });
			});
		},
		get id() {
			return getId();
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
	} satisfies ValidatorMap<Map> & { channel: BroadcastChannel; id: Id };
}
