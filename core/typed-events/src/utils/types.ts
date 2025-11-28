import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { Id } from "./id";

export type ListenerCallback<Input> = (payload: AnyPayload<Input>) => void;

export type Restrict<T extends string, Forbidden> = T extends Forbidden
	? never
	: T;

export interface ValidatorMap<
	EventMap extends Record<string, StandardSchemaV1>,
	DispatchOpts = {},
> {
	dispatch<
		Name extends keyof EventMap & string,
		Input extends object & StandardSchemaV1.InferInput<EventMap[Name]>,
	>(
		name: Name,
		input: Input,
		opts?: DispatchOpts,
	): void;

	listen<
		Event extends keyof EventMap & string,
		Input extends object & StandardSchemaV1.InferInput<EventMap[Event]>,
	>(
		name: Event,
		callback: ListenerCallback<Input>,
	): () => void;

	map: EventMap;
	name: string;
}

type AnyPayload<T> = {
	[K in keyof RawEventMap<T>]: Payload<T, K>;
}[keyof RawEventMap<T>];

type Payload<Input, E extends keyof RawEventMap<Input>> = {
	data: Input;
	raw: RawEvent<E, Input>;
	type: E;
};

type RawEvent<
	Type extends keyof RawEventMap<Shape>,
	Shape,
> = RawEventMap<Shape>[Type];

type RawEventMap<Shape> = {
	event: CustomEvent<Shape>;
	message: MessageEvent<Shape>;
};
