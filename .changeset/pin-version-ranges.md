---
"@stephansama/pnpm-hooks": patch
---

`pinAllDependencies` now pins `>=`, `=`, `v`-prefixed, hyphen (`1.2.3 - 2.0.0`) and `npm:` alias ranges to their lower bound, and leaves ranges it can't pin exactly (`>`, `<`, `||`, x-ranges, partial versions, dist-tags, `workspace:` and other protocols) unchanged instead of corrupting them
