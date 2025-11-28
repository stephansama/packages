import type { StandardSchemaV1 } from "@standard-schema/spec";

import { validate, ValidatorError, type ValidatorMap } from "@/utils";

export class TypedEventMapError extends ValidatorError {
	constructor(id: string, issues: readonly StandardSchemaV1.Issue[]) {
		super("TypedEventMap", id, issues);
	}
}

export function createEventMap<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
>(name: Name, map: Map) {
	let _target: EventTarget | null = null;

	const _scopeEvent = (event: string) => [name, event].join(":");

	function _validate<
		Event extends keyof Map & string,
		Input extends StandardSchemaV1.InferInput<Map[Event]>,
	>(event: Event, message: Input, callback: () => void) {
		validate({
			callback,
			data: message,
			onerror: (issues) => {
				throw new TypedEventMapError(_scopeEvent(event), issues);
			},
			schema: map[event],
			source: "TypedEventMap",
		});
	}

	return {
		dispatch(name, detail) {
			const callback = () => {
				const scopedName = _scopeEvent(name);
				const event = new CustomEvent<typeof detail>(scopedName, {
					detail,
				});
				this.target.dispatchEvent(event);
			};

			_validate(name, detail, callback);
		},
		listen(name, callback) {
			const scopedName = _scopeEvent(name);
			const listener = (e: Event) => {
				if (e instanceof CustomEvent && e.type === scopedName) {
					_validate(name, e.detail, () => {
						callback({ data: e.detail, raw: e, type: "event" });
					});
				}
			};

			this.target.addEventListener(scopedName, listener);
			return () => this.target.removeEventListener(scopedName, listener);
		},
		map,
		name,
		get target() {
			return (_target ??= document);
		},
		set target(target: EventTarget) {
			if (!target) {
				throw new Error("not a valid event target");
			}
			_target = target;
		},
	} satisfies ValidatorMap<Name, Map, "event"> & { target: EventTarget };
}
