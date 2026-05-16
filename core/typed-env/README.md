<div align="center">

# [`@stephansama`](https://github.com/stephansama) / typed-env

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-env)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-env)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ftyped-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-env)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/typed-env)](https://socket.dev/npm/package/@stephansama/typed-env/overview)
[![jsr](https://jsr.io/badges/@stephansama/typed-env)](https://jsr.io/@stephansama/typed-env)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-env?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-env)

[![@dotenvx/dotenvx](https://img.shields.io/badge/@dotenvx/dotenvx-1.52.0-ECD53F.svg?logo=dotenv&logoColor=ffffff&labelColor=ECD53F)](https://npmx.dev/package/@dotenvx/dotenvx)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)

<!-- BADGE end -->

</div>

standard schema compatible environment validator

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/typed-env
```

## Usage

```typescript
import * as z from "zod";

import { createEnvironment } from "@stephansama/typed-env";

export const config = createEnvironment(
  z.object({
    GENERATIVE_API_KEY: z.string().trim(),
    OTHER_SUPER_SECRET_KEY: z.string().trim(),
  }),
);

export async function generateExample() {
  return await config.generateExample(".env.example");
}

export async function validateEnvironment() {
  return await config.validate();
}
```
