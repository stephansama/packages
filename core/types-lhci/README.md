# @stephansama/types-lhci

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/types-lhci)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/types-lhci)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ftypes-lhci?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-lhci)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/types-lhci?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-lhci)

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

```javascript
import { lhciSchema } from "@stephansama/types-lhci";

/** @type {import('../dist/index.d.cts').LhciSchema} */
const config = {
  ci: {
    upload: {
      githubAppToken: process.env.GITHUB_APP_TOKEN,
      serverBaseUrl: "https://lhci.example.com",
      target: "lhci",
      token: "project-token",
    },
  },
};
```

you can also verify the config object later

```javascript
lhciSchema.parse(config);
```
