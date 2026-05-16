<div align="center">

# [`@stephansama`](https://github.com/stephansama) / types-lhci

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/types-lhci)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/types-lhci)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ftypes-lhci?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-lhci)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/types-lhci)](https://socket.dev/npm/package/@stephansama/types-lhci/overview)
[![jsr](https://jsr.io/badges/@stephansama/types-lhci)](https://jsr.io/@stephansama/types-lhci)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/types-lhci?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-lhci)

[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)

<!-- BADGE end -->

</div>

types for lhci configuration

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/types-lhci
```

## Usage

```typescript
import { lhciSchema, type LhciSchema } from "@stephansama/types-lhci";

const config = {
  ci: {
    upload: {
      githubAppToken: process.env.GITHUB_APP_TOKEN,
      serverBaseUrl: "https://lhci.example.com",
      target: "lhci",
      token: "project-token",
    },
  },
} satisfies LhciSchema;
```

you can also verify the config object later

```typescript
lhciSchema.parse(config);
```
