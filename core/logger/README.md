# @stephansama/logger

Tiny namespaced logger with `debug` / `info` / `warn` / `error` levels. Drop-in shape replacement for the `obug` pattern used across `ai-commit-msg`, `auto-readme`, and `single-file`, with two upgrades:

1. **Log levels.** Controlled by `LOG_LEVEL` env var (`debug` / `info` / `warn` / `error`, default `info`). Levels below the configured threshold are zero-cost — the message and format args are never evaluated.
2. **JSON mode.** Set `LOG_FORMAT=json` (e.g. in CI / production) to emit structured one-line records per call. Otherwise output is pretty: `[namespace] message …args`.

## Usage

```ts
import { createLogger } from "@stephansama/logger";

const log = createLogger("auto-readme");

log.debug("parsing comment", { file });
log.info("processing %d files", count);
log.warn("no config found, using defaults");
log.error("failed to load action data", error);
```

## Env vars

| Var          | Values                            | Default |
| ------------ | --------------------------------- | ------- | ------ | ------- | ------ |
| `LOG_LEVEL`  | `debug`                           | `info`  | `warn` | `error` | `info` |
| `LOG_FORMAT` | `json` (any other value → pretty) | pretty  |

Warnings and errors go to `console.error`; debug and info go to `console.log`.
