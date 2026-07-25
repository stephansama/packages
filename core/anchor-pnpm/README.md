# @stephansama/anchor-pnpm

CLI for managing YAML anchor declarations in `pnpm-workspace.yaml`.

Many pnpm catalog setups repeat the same version string across multiple packages in a catalog group:

```yaml
catalogs:
  alpine:
    alpinejs: 3.15.8
    "@alpinejs/focus": 3.15.8
```

Sharing the version via a YAML anchor keeps them in lock-step:

```yaml
__versions:
  - &alpine 3.15.8

catalogs:
  alpine:
    alpinejs: *alpine
    "@alpinejs/focus": *alpine
```

`anchor-pnpm` automates creating and maintaining that `__versions` block while preserving the surrounding YAML (anchors, comments, ordering) via the `yaml` package's Document API.

## Commands

- `anchor-pnpm list` — print every anchor name and resolved version.
- `anchor-pnpm add <name> <version>` — append a new `&<name> <version>` entry.
- `anchor-pnpm update <name> <version>` — set the scalar value of an existing anchor (all `*<name>` aliases follow automatically).
- `anchor-pnpm remove <name>` — remove the anchor; errors if aliases still reference it (pass `--force` to inline them first).
- `anchor-pnpm sync` — _scheduled, not yet implemented._ Auto-detect catalog groups with repeated versions and convert them to anchor+alias pairs.

## Global flags

```
--workspace, -w   Path to pnpm-workspace.yaml  (default: auto-detect via @manypkg/find-root)
--dry-run,  -d    Print the rewritten YAML to stdout instead of writing
--verbose,  -v    Show detailed output
```
