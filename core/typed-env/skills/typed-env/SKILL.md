---
name: typed-env
description: >
  Validate and type process.env environment variables at runtime using
  createEnvironment with a standard-schema-compatible validator. Supports zod,
  valibot, and arktype only. Use when setting up environment validation,
  auto-loading .env files via dotenvx, or generating .env.example placeholder
  files from a schema shape.
type: core
library: "@stephansama/typed-env"
library_version: "1.0.0"
sources:
  - stephansama/packages:core/typed-env/src/index.ts
  - stephansama/packages:core/typed-env/README.md
---

# typed-env

Runtime environment validation with full TypeScript inference. `createEnvironment` wraps a standard-schema object schema and returns helpers for loading, validating, and documenting your environment.

## Setup

```ts
import * as z from "zod";
import { createEnvironment } from "@stephansama/typed-env";

export const env = createEnvironment(
  z.object({
    DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
  }),
  true, // auto-load .env quietly via dotenvx
);
```

Call `env.validate()` once at application startup to fail fast with a descriptive error on missing or invalid values.

## Core Patterns

### Validate at startup

```ts
// src/env.ts
import * as z from "zod";
import { createEnvironment } from "@stephansama/typed-env";

export const env = createEnvironment(
  z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
  }),
  true,
);

// src/main.ts
import { env } from "./env";

const config = await env.validate();
// config is fully typed: { PORT: number; DATABASE_URL: string }
```

### Generate a .env.example file

```ts
import { generateExample } from "./env";

// writes placeholder values (***) for each key in the schema
await env.generateExample(".env.example");
```

Run this as a script or CI step to keep `.env.example` in sync with the schema. Requires zod, valibot, or arktype — the schema's `vendor` field determines how keys are extracted.

### Custom dotenvx options

```ts
export const env = createEnvironment(schema, {
  path: ".env.production",
  override: true,
});
```

Pass a `DotenvConfigOptions` object as the second argument instead of `true` for custom `.env` file paths, override behaviour, or encryption options.

### Load env without auto-loading

```ts
export const env = createEnvironment(schema);
// load manually when needed
env.loadEnv({ path: ".env.local" });
const config = await env.validate();
```

## Common Mistakes

### CRITICAL Schema library other than zod, valibot, or arktype

Wrong:

```ts
import { Type } from "@sinclair/typebox";
const env = createEnvironment(Type.Object({ KEY: Type.String() }));
await env.generateExample(".env.example"); // throws: "invalid schema provider"
```

Correct:

```ts
import * as z from "zod";
const env = createEnvironment(z.object({ KEY: z.string() }));
await env.generateExample(".env.example");
```

`generateExample` uses a hard-coded vendor switch on `schema["~standard"].vendor`. Only `"zod"`, `"valibot"`, and `"arktype"` are handled. Any other standard-schema implementation throws.

Source: `core/typed-env/src/index.ts:getObjectFromSchema`

### HIGH Not passing loadEnvironmentConfig — .env values missing

Wrong:

```ts
const env = createEnvironment(schema);
await env.validate(); // process.env has no .env values loaded → validation fails
```

Correct:

```ts
const env = createEnvironment(schema, true);
await env.validate();
```

`createEnvironment` does not load any `.env` file by default. `validate()` reads `process.env` as-is. Pass `true` or a `DotenvConfigOptions` object as the second argument to auto-load via dotenvx.

Source: `core/typed-env/src/index.ts:createEnvironment`

### MEDIUM validate() throws raw JSON on failure

Wrong:

```ts
// unhandled — crashes process with raw JSON in message
const config = await env.validate();
```

Correct:

```ts
try {
  const config = await env.validate();
} catch (err) {
  console.error("Environment validation failed:", (err as Error).message);
  process.exit(1);
}
```

On validation failure, `validate()` throws `new Error(JSON.stringify(issues))`. The message is machine-readable JSON. Wrap in try/catch at startup and exit explicitly with a human-readable message.

Source: `core/typed-env/src/index.ts:validate`

See also: `typed-templates/SKILL.md` — same vendor restriction applies.
