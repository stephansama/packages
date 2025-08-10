import chalk from "chalk";

let verbosity = 0;

export function ERROR(...rest: unknown[]) {
	const [first, ...remaining] = rest;
	console.error(chalk.red(first), ...remaining);
}

export function INFO(...rest: unknown[]) {
	if (verbosity < 1) return;
	const [first, ...remaining] = rest;
	console.info(chalk.blue(first), ...remaining);
}

export function setVerbosity(input: number) {
	verbosity = input;
}

export function WARN(...rest: unknown[]) {
	if (verbosity < 1) return;
	const [first, ...remaining] = rest;
	console.warn(chalk.yellow(first), ...remaining);
}
