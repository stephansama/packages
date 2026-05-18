/**
 * Tiny namespaced logger with `debug` / `info` / `warn` / `error` levels.
 *
 * - `LOG_LEVEL` env var (case-insensitive) chooses the minimum level to emit.
 *   Defaults to `info`. Any level at or above the configured one is emitted.
 * - `LOG_FORMAT=json` emits one JSON object per line (timestamp, level,
 *   namespace, message, args). Otherwise emits pretty output: `[namespace]
 *   message …args`.
 * - Suppressed levels are zero-cost: the message + format args are never
 *   evaluated when the level is below threshold.
 *
 * Drop-in replacement for `obug.createDebug(namespace)` — `log.debug(...)` is
 * equivalent shape-wise to the obug call site.
 */

export type LogLevel = "debug" | "error" | "info" | "warn";

const LEVEL_ORDER: Record<LogLevel, number> = {
	debug: 10,
	error: 40,
	info: 20,
	warn: 30,
};

export interface Logger {
	debug(message: string, ...arguments_: unknown[]): void;
	error(message: string, ...arguments_: unknown[]): void;
	info(message: string, ...arguments_: unknown[]): void;
	warn(message: string, ...arguments_: unknown[]): void;
}

/** Build a namespaced logger. The namespace is prefixed to every emitted line. */
export function createLogger(namespace: string): Logger {
	const minWeight = LEVEL_ORDER[resolveMinLevel()];
	const isJson = process.env.LOG_FORMAT === "json";
	const emit = isJson ? emitJson : emitPretty;

	function makeLevel(level: LogLevel): Logger[LogLevel] {
		const weight = LEVEL_ORDER[level];
		if (weight < minWeight) {
			return () => {
				// suppressed level — zero-cost noop
			};
		}
		return (message: string, ...arguments_: unknown[]) =>
			emit(namespace, level, message, arguments_);
	}

	return {
		debug: makeLevel("debug"),
		error: makeLevel("error"),
		info: makeLevel("info"),
		warn: makeLevel("warn"),
	};
}

function emitJson(
	namespace: string,
	level: LogLevel,
	message: string,
	arguments_: unknown[],
): void {
	const record = {
		args: arguments_,
		level,
		message,
		namespace,
		timestamp: new Date().toISOString(),
	};
	const stream = level === "error" || level === "warn" ? "error" : "log";
	// eslint-disable-next-line no-console
	console[stream](JSON.stringify(record));
}

function emitPretty(
	namespace: string,
	level: LogLevel,
	message: string,
	arguments_: unknown[],
): void {
	const stream = level === "error" || level === "warn" ? "error" : "log";
	// eslint-disable-next-line no-console
	console[stream](`[${namespace}]`, message, ...arguments_);
}

function resolveMinLevel(): LogLevel {
	const raw = (process.env.LOG_LEVEL ?? "info").toLowerCase();
	if (
		raw === "debug" ||
		raw === "info" ||
		raw === "warn" ||
		raw === "error"
	) {
		return raw;
	}
	return "info";
}
