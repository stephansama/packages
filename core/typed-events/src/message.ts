import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError, type ValidatorMap } from "@/utils";

export class TypedMessageError extends ValidatorError {
	constructor(scope: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedMessageError", scope, issues);
	}
}

export function createMessage<Map extends Record<string, StandardSchemaV1>>(
	name: string,
	map: Map,
) {
	let _window: null | Window = null;
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
			const listener = (raw: MessageEvent) => {
				const { data } = raw;
				if (data.id !== _scopeName(name)) return;
				_validate(name, data, () => {
					callback({ data, raw, type: "message" });
				});
			};
			this.window.addEventListener("message", listener);
			return () => this.window.removeEventListener("message", listener);
		},
		map,
		name,
		get window() {
			if (!_window) _window = window;
			return _window;
		},
		set window(input: Window) {
			_window = input;
		},
	} satisfies ValidatorMap<Map> & { window: Window };
}
