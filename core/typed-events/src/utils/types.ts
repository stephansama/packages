import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { StandardSchemaV1 };

export type { Id } from "./id";

export type { TypedBroadcastChannel } from "@/broadcast";
export type { TypedBroadcastEvent } from "@/broadcast-event";
export type { TypedEvent } from "@/event";
export type { TypedEventMap } from "@/event-map";

export type ListenerCallback<Input, Keys extends keyof RawEventMap> = (
	payload: AnyPayload<Input, Keys>,
) => void;

export type RawEventMap<Shape = any> = {
	event: CustomEvent<Shape>;
	message: MessageEvent<Shape>;
};

export type Restrict<T extends string, Forbidden> = T extends Forbidden
	? never
	: T;

export interface Validator<
	Name extends string,
	Schema extends StandardSchemaV1,
	EventTypeKeys extends keyof RawEventMap,
	DispatchOpts = {},
	Input = object & StandardSchemaV1.InferInput<Schema>,
> {
	dispatch(input: Input, opts?: DispatchOpts): void;
	listen(callback: ListenerCallback<Input, EventTypeKeys>): () => void;

	name: Name;
	schema: Schema;
}

export interface ValidatorMap<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
	EventTypeKeys extends keyof RawEventMap,
	DispatchOpts = {},
> {
	dispatch<
		Event extends keyof Map & string,
		Input extends object & StandardSchemaV1.InferInput<Map[Event]>,
	>(
		name: Event,
		input: Input,
		opts?: DispatchOpts,
	): void;

	listen<
		Event extends keyof Map & string,
		Input extends object & StandardSchemaV1.InferInput<Map[Event]>,
	>(
		name: Event,
		callback: ListenerCallback<Input, EventTypeKeys>,
	): () => void;

	map: Map;
	name: Name;
}

type AnyPayload<T, Keys extends keyof RawEventMap> = {
	[K in Keys]: Payload<T, K>;
}[Keys];

type Payload<Input, E extends keyof RawEventMap<Input>> = {
	data: Input;
	raw: RawEvent<E, Input>;
	type: E;
};

type RawEvent<
	Type extends keyof RawEventMap<Shape>,
	Shape,
> = RawEventMap<Shape>[Type];
