// based on https://github.com/mattpocock/ts-reset

interface Array<T> {
	filter<S extends T>(
		predicate: BooleanConstructor,
		thisArg?: any,
	): NonFalsy<S>[];
}

type NonFalsy<T> = T extends 0 | 0n | "" | false | null | undefined ? never : T;

interface ReadonlyArray<T> {
	filter<S extends T>(
		predicate: BooleanConstructor,
		thisArg?: any,
	): NonFalsy<S>[];
}
