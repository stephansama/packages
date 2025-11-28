import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { Id } from "./id";

export type ListenerCallback<Input> = (payload: AnyPayload<Input>) => void;

export type Restrict<T extends string, Forbidden> = T extends Forbidden
	? never
	: T;

export interface ValidatorMap<
	Name extends string,
	Map extends Record<string, StandardSchemaV1>,
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
		callback: ListenerCallback<Input>,
	): () => void;

	map: Map;
	name: Name;
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
