# @stephansama/typed-config

One `createConfig` call wraps cosmiconfig + smol-toml + xdg-app-paths and validates the result through any [Standard Schema V1](https://standardschema.dev/) validator (zod, valibot, arktype).

```ts
import { createConfig } from "@stephansama/typed-config";
import * as z from "zod";

const schema = z.object({
  model: z.string().default("llama2"),
  verbose: z.boolean().default(false),
});

const { config } = await createConfig({
  name: "my-tool",
  schema,
  xdg: true,
});
// config is fully typed as z.infer<typeof schema>
```

## Search order

1. Standard cosmiconfig discovery (`.my-toolrc`, `.my-toolrc.{json,yaml,yml,toml}`, `package.json#my-tool`).
2. `.config/.my-toolrc.{json,yaml,yml,toml}` under the project root.
3. (When `xdg: true`) `$XDG_CONFIG_HOME/my-tool/config.{json,yaml,yml,toml}` — falling back to `~/.config/my-tool/`.

The first file found wins. Explicit `defaults` are merged underneath the loaded file before validation, so a partial config file still validates.

## TOML support

A cosmiconfig custom loader powered by `smol-toml` is registered automatically — no extra setup needed at the call site.

## Validation

`schema` accepts any Standard-Schema-V1 validator. zod, valibot, and arktype all satisfy the spec out of the box. Validation errors throw with all collected issues joined into one message.
