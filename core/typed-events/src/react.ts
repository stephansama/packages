import type { StandardSchemaV1 } from "@standard-schema/spec";

import * as React from "react";

import type {
	ListenerCallback,
	RawEventMap,
	Validator,
	ValidatorMap,
} from "@/utils/types";

export function useListener<
	Name extends string,
	Input extends Validator<Name, Schema, Keys>,
	Schema extends StandardSchemaV1 = Input extends Validator<
		Name,
		infer S,
		any
	>
		? S
		: never,
	Keys extends keyof RawEventMap = Input extends Validator<
		Name,
		Schema,
		infer K
	>
		? K
		: never,
>(event: Input, listener: Parameters<Input["listen"]>[0]) {
	React.useEffect(() => {
		const cleanup = event.listen(listener);
		return () => cleanup();
	}, []);
}

/**
 * @param map - typed validated event map
 * @param listeners - map of listeners to add
 */
export function useListeners<
	Name extends string,
	Map extends ValidatorMap<Name, EventMap, EventTypeKeys>,
	EventMap extends Record<
		string,
		StandardSchemaV1
	> = Map extends ValidatorMap<Name, infer EM, any, any> ? EM : never,
	EventTypeKeys extends keyof RawEventMap = Map extends ValidatorMap<
		Name,
		EventMap,
		infer K,
		any
	>
		? K
		: never,
>(
	map: Map,
	listeners: {
		[K in keyof EventMap]?: ListenerCallback<
			StandardSchemaV1.InferInput<EventMap[K]>,
			EventTypeKeys
		>;
	},
) {
	React.useEffect(() => {
		const cleanups = Object.entries(listeners).map(([event, callback]) => {
			return map.listen(event, callback);
		});

		return () => {
			for (const cleanup of cleanups) cleanup();
		};
	}, []);
}
