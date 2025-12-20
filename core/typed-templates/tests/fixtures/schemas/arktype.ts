import { type } from "arktype";

export const arkUser = type({
	age: "number?",
	name: "string",
	tags: "string[]",
});
