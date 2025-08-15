import debug from "debug";

const error = debug("autoreadme:error");
const info = debug("autoreadme:info");
const warn = debug("autoreadme:warn");

export function ERROR(...rest: unknown[]) {
	const [first, ...remaining] = rest;
	error(`${first} %O`, ...remaining);
}

export function INFO(...rest: unknown[]) {
	const [first, ...remaining] = rest;
	info(`${first} %O`, ...remaining);
}

export function WARN(...rest: unknown[]) {
	const [first, ...remaining] = rest;
	warn(`${first} %O`, ...remaining);
}
