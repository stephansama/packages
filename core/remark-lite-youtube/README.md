# @stephansama/remark-lite-youtube

Remark plugin that transforms YouTube URL links in markdown into [`<lite-youtube>`](https://github.com/justinribeiro/lite-youtube) custom-element markup. Drop-in companion to `@justinribeiro/lite-youtube`, which renders the embed lazily without the full YouTube iframe payload.

## Input → output

```markdown
[My Video Title](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

```html
<lite-youtube videoid="dQw4w9WgXcQ" playlabel="My Video Title"></lite-youtube>
```

## Supported URL formats

- `https://www.youtube.com/watch?v={id}`
- `https://youtu.be/{id}`
- `https://www.youtube.com/embed/{id}`

Non-YouTube links are left untouched.

## Options

```ts
import remarkLiteYoutube from "@stephansama/remark-lite-youtube";

remark().use(remarkLiteYoutube, {
  defaultPlayLabel: "Watch", // used when the markdown link has no text; defaults to "Play"
});
```

## Pairing in Astro

```ts
import remarkLiteYoutube from "@stephansama/remark-lite-youtube";

export default defineConfig({
  markdown: { remarkPlugins: [remarkLiteYoutube] },
});
```
