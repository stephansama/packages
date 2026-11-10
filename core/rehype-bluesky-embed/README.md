<div align="center">

# [`@stephansama`](https://github.com/stephansama) / rehype-bluesky-embed

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/rehype-bluesky-embed)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/rehype-bluesky-embed)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Frehype-bluesky-embed?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/rehype-bluesky-embed)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/rehype-bluesky-embed)](https://socket.dev/npm/package/@stephansama/rehype-bluesky-embed/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/rehype-bluesky-embed?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/rehype-bluesky-embed)

A rehype plugin that turns links to Bluesky posts into embedded posts.

</div>

##### Table of contents

<details><summary>Open Table of contents</summary>

- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [With remark-oembed](#with-remark-oembed)
- [Notes](#notes)

</details>

## How it works

Put a link to a Bluesky post on a line of its own:

```markdown
Here's what they said:

https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l
```

At build time the plugin asks [Bluesky's oEmbed endpoint](https://docs.bsky.app/docs/advanced-guides/oembed) for that post and swaps the paragraph for Bluesky's embed markup:

```html
<blockquote
  class="bluesky-embed"
  data-bluesky-uri="at://did:plc:…/app.bsky.feed.post/3l6oveex3ii2l"
  data-bluesky-cid="…"
>
  <p lang="en">…</p>
  — Bluesky (<a href="…">@bsky.app</a>)
</blockquote>
<script
  async
  src="https://embed.bsky.app/static/embed.js"
  charset="utf-8"
></script>
```

Bluesky's script then upgrades the blockquote into the full interactive post. Readers without JavaScript still see the post's text.

Links inside a sentence are left alone, and so is any post that can't be fetched (deleted, private, or the network is down). In that case the link stays as it was and a warning is added to the file.

## Installation

```sh
pnpm install @stephansama/rehype-bluesky-embed
```

## Usage

### unified

```typescript
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import blueskyEmbed from "@stephansama/rehype-bluesky-embed";

const file = await unified()
  .use(rehypeParse, { fragment: true })
  .use(blueskyEmbed)
  .use(rehypeStringify)
  .process(
    '<p><a href="https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l">https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l</a></p>',
  );
```

### Astro

```typescript
import { defineConfig } from "astro/config";

import blueskyEmbed from "@stephansama/rehype-bluesky-embed";

export default defineConfig({
  markdown: {
    rehypePlugins: [[blueskyEmbed, { script: false }]],
  },
});
```

## Options

| Option      | Type                                        | Default            | Description                                                                        |
| ----------- | ------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `script`    | `boolean`                                   | `true`             | Keep the `embed.bsky.app` script tag. Turn off if your site already loads it once. |
| `colorMode` | `"system" \| "light" \| "dark"`             | Bluesky's own      | Sets `data-bluesky-embed-color-mode` on the embed.                                 |
| `cache`     | `Map<string, Promise<string \| undefined>>` | shared per process | Cache of fetched embeds, so a post used on several pages is fetched once.          |
| `fetch`     | `typeof fetch`                              | `globalThis.fetch` | Custom fetch, handy for tests or proxies.                                          |

## With remark-oembed

`remark-oembed` and similar markdown-side oEmbed plugins know Bluesky too. They run before any rehype plugin and swap a standalone post link for their own widget, so this plugin never sees it. Add `remarkBlueskyPassthrough` before them to keep Bluesky links for this plugin:

```typescript
import blueskyEmbed, {
  remarkBlueskyPassthrough,
} from "@stephansama/rehype-bluesky-embed";
import oembed from "remark-oembed";

export default defineConfig({
  markdown: {
    rehypePlugins: [[blueskyEmbed, { script: false }]],
    remarkPlugins: [remarkBlueskyPassthrough, oembed],
  },
});
```

## Notes

- Embeds are fetched while your site builds, so the build needs network access to `embed.bsky.app`.
- Only `https://bsky.app/profile/<handle-or-did>/post/<id>` links are converted.
- If you set `script: false`, load `https://embed.bsky.app/static/embed.js` yourself. On sites with client-side navigation, call `window.bluesky.scan()` after each page change.
