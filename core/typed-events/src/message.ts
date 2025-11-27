import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError, ValidatorMap } from "./utils";

export class TypedMessageError extends ValidatorError {
	constructor(scope: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedMessageError", scope, issues);
	}
}

export function createTypedMessage<
	Map extends Record<string, StandardSchemaV1>,
>(name: string, map: Map) {
	const _scopeName = (input: string) => [name, input].join(":");

	function _validate<Name extends keyof Map>(
		name: Name & string,
		message: StandardSchemaV1.InferInput<Map[Name]>,
		callback: () => void,
	) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedMessageError(name, issues);
			},
			schema: map[name],
			source: "TypedMessage",
		});
	}

	return {
		dispatch(name, input) {
			_validate(name, input, () => {
				const id = _scopeName(name);
				const data = { ...input, id };

				return this.window.postMessage(data, this.window.origin);
			});
		},
		listen(name, callback) {
			const listener = (message: MessageEvent) => {
				const data = message.data;
				if (data.id !== _scopeName(name)) return;
				_validate(name, data, () => {
					callback({ data, raw: message, type: "message" });
				});
			};
			this.window.addEventListener("message", listener);
			return () => this.window.removeEventListener("message", listener);
		},
		map,
		name,
		get window() {
			return window;
		},
		set window(input: Window) {
			this.window = input;
		},
	} satisfies ValidatorMap<Map> & { window: Window };
}
