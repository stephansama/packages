<div align="center">

# [`@stephansama`](https://github.com/stephansama) remark-asciinema

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/remark-asciinema)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/remark-asciinema)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fremark-asciinema?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/remark-asciinema)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/remark-asciinema)](https://socket.dev/npm/package/@stephansama/remark-asciinema/overview)
[![jsr](https://jsr.io/badges/@stephansama/remark-asciinema)](https://jsr.io/@stephansama/remark-asciinema)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/remark-asciinema?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/remark-asciinema)

[![remark](https://img.shields.io/badge/remark-15.0.1-000000.svg?logo=remark&logoColor=ffffff&labelColor=000000)](https://npmx.dev/package/remark)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

A [remark](https://github.com/remarkjs/remark) plugin that transforms asciinema links into either an embedded [asciinema](https://docs.asciinema.org/manual/player/) player or screenshot that links to the recording.

## Features

- 🪄 Automatically converts asciinema links into:
  - `<script>` embeds for live asciinema players
  - `<img>` tags for static cast thumbnails that link to the recording

## Example

![Example](https://raw.githubusercontent.com/stephansama/static/refs/heads/main/packages/remark-asciinema.gif)

Before:

```markdown
Check out this demo: https://asciinema.org/a/12345
```

After (HTML output):

```html
Check out this demo:
<script
  id="asciicast-12345"
  src="https://asciinema.org/a/12345.js"
  async
></script>
```

## Installation

```bash
pnpm install @stephansama/remark-asciinema
```

## Usage

```javascript
import { remark } from "remark";

import asciinema from "@stephansama/remark-asciinema";

export async function pipeline() {
  const file = await remark()
    .use(asciinema, { embedType: "script" })
    .process("Check out: https://asciinema.org/a/abc123");

  console.info(String(file));
}
```

## Additional notes

**Note**: After integrating the Remark plugin, ensure you include the necessary asciinema JavaScript and CSS files to enable proper playback and styling. You can load them via [UNPKG](https://unpkg.com/):

- <https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.css>
- <https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.min.js>
