---
"@stephansama/multipublish": patch
---

Fix JSR publishing of gitignored build output, and fail the run when a publish fails

- Directories that `exports` point into (e.g. `dist`) are added to the JSR config's `publish.exclude` as negated globs, so gitignored build output is published instead of failing with `excluded-module`
- `defaultInclude` / `defaultExclude` now go to `publish.include` / `publish.exclude`, where JSR honors negated globs like `!config`, and a user's own `publish` block is kept
- A failed publish no longer exits `0`: the remaining platforms and packages are still attempted, then the CLI lists what failed and exits `1`
- Publish errors no longer repeat the publish command, which contained the JSR auth token
- An unscoped package with the `.npmrc` strategy now fails instead of being skipped silently
