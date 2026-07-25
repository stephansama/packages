<div align="center">

# [`@stephansama`](https://github.com/stephansama/packages) packages

<!-- BADGE --skip-templates start -->

[![@commitlint/cli](https://img.shields.io/badge/@commitlint/cli-19.8.1-000000.svg?logo=commitlint&logoColor=ffffff&labelColor=000000)](https://npmx.dev/package/@commitlint/cli)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![eslint](https://img.shields.io/badge/eslint-10.2.1-4B32C3.svg?logo=eslint&logoColor=ffffff&labelColor=4B32C3)](https://npmx.dev/package/eslint)
[![knip](https://img.shields.io/badge/knip-5.88.1-F56E0F.svg?logo=knip&logoColor=ffffff&labelColor=F56E0F)](https://npmx.dev/package/knip)
[![prettier](https://img.shields.io/badge/prettier-3.8.1-F7B93E.svg?logo=prettier&logoColor=ffffff&labelColor=F7B93E)](https://npmx.dev/package/prettier)
[![turbo](https://img.shields.io/badge/turbo-2.8.20-FF1E56.svg?logo=turborepo&logoColor=ffffff&labelColor=FF1E56)](https://npmx.dev/package/turbo)
[![typescript](https://img.shields.io/badge/typescript-5.9.3-3178C6.svg?logo=typescript&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/typescript)
[![vitest](https://img.shields.io/badge/vitest-4.1.6-00FF74.svg?logo=vitest&logoColor=ffffff&labelColor=00FF74)](https://npmx.dev/package/vitest)
[![lefthook](https://img.shields.io/badge/lefthook-2.1.6-FF1E1E.svg?logo=lefthook&logoColor=ffffff&labelColor=FF1E1E)](https://npmx.dev/package/lefthook)

<!-- BADGE end -->

[![codecov](https://codecov.io/github/stephansama/packages/graph/badge.svg)](https://codecov.io/github/stephansama/packages)
[![🦋 Changesets Release](https://github.com/stephansama/packages/actions/workflows/release.yml/badge.svg)](https://github.com/stephansama/packages/actions/workflows/release.yml)
[![CodeQL](https://github.com/stephansama/packages/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/stephansama/packages/actions/workflows/github-code-scanning/codeql)

Collection of open-source [npm](https://www.npmx.dev/) packages

</div>

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Introduction](#introduction)
- [AI Agent Support](#ai-agent-support)
- [📦 Packages](#-packages)
  - [☂️ Codecov coverage graph](#️-codecov-coverage-graph)
- [Related repositories](#related-repositories)

</details>

## Introduction

view examples here 👉 [![packages](https://pkg.pr.new/badge/stephansama/packages?style=flat&color=000&logoSize=auto)](https://pkg.pr.new/~/stephansama/packages)

or install an example with [`create-stephansama-example`](https://github.com/stephansama/packages/tree/main/core/example)
via `pnpm create stephansama-example`

## AI Agent Support

If you use an AI agent (Claude Code, Cursor, Copilot, etc.), run the following to install skills for all packages:

```sh
pnpm dlx @tanstack/intent@latest install
```

## 📦 Packages

All packages are packaged underneath the `@stephansama` scope (for example: `@stephansama/remark-asciinema`)

<!-- WORKSPACE start -->

### 🏭 workspace

| 🏷️ Name                                                                   | Version                                                                                                                                               | 📥 Downloads                                                                                               | 📝 Description                                                                                |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [ai-commit-msg](core/ai-commit-msg/README.md)                             | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fai-commit-msg?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)               | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/ai-commit-msg?labelColor=211F1F)               | generate commit messages using ai                                                             |
| [alfred-kaomoji](core/alfred-kaomoji/README.md)                           | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Falfred-kaomoji?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)              | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/alfred-kaomoji?labelColor=211F1F)              | Alfred Kaomoji Picker                                                                         |
| [anchor-pnpm](core/anchor-pnpm/README.md)                                 | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fanchor-pnpm?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                 | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/anchor-pnpm?labelColor=211F1F)                 | Manage YAML anchor declarations in pnpm-workspace.yaml                                        |
| [astro-iconify-svgmap](core/astro-iconify-svgmap/README.md)               | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fastro-iconify-svgmap?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)        | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/astro-iconify-svgmap?labelColor=211F1F)        | Astro integration for generating iconify svgmaps for ssg sites                                |
| [auto-readme](core/auto-readme/README.md)                                 | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                 | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)                 | Generate lists and tables for your README automagically based on your repository and comments |
| [catppuccin-jsonresume-theme](core/catppuccin-jsonresume-theme/README.md) | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fcatppuccin-jsonresume-theme?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F) | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/catppuccin-jsonresume-theme?labelColor=211F1F) | theme for resume cli website                                                                  |
| [catppuccin-opml](core/catppuccin-opml/README.md)                         | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fcatppuccin-opml?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)             | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/catppuccin-opml?labelColor=211F1F)             | Catppuccin styled opml stylesheet                                                             |
| [catppuccin-rss](core/catppuccin-rss/README.md)                           | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fcatppuccin-rss?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)              | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/catppuccin-rss?labelColor=211F1F)              | Catppuccin x Pretty-feed-v3                                                                   |
| [catppuccin-typedoc](core/catppuccin-typedoc/README.md)                   | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fcatppuccin-typedoc?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)          | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/catppuccin-typedoc?labelColor=211F1F)          | Catppuccin css variable theme for typedoc                                                     |
| [catppuccin-xsl](core/catppuccin-xsl/README.md)                           | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fcatppuccin-xsl?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)              | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/catppuccin-xsl?labelColor=211F1F)              | Catppuccin styles for various xsl formats                                                     |
| [eslint-config](core/eslint-config/README.md)                             | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Feslint-config?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)               | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/eslint-config?labelColor=211F1F)               | stephansama eslint configuration for multiple use cases                                       |
| [create-stephansama-example](core/example/README.md)                      | ![npm version image](https://img.shields.io/npm/v/create-stephansama-example?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                   | ![npm downloads](https://img.shields.io/npm/dw/create-stephansama-example?labelColor=211F1F)               | Download an example from the @stephansama/packages examples                                   |
| [find-makefile-targets](core/find-makefile-targets/README.md)             | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ffind-makefile-targets?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)       | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/find-makefile-targets?labelColor=211F1F)       | Find makefile targets used to pipe into fzf                                                   |
| [github-env](core/github-env/README.md)                                   | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fgithub-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                  | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/github-env?labelColor=211F1F)                  | \[Deprecated] Additional environment variable types for GitHub CI                             |
| [inline-image](core/inline-image/README.md)                               | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Finline-image?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/inline-image?labelColor=211F1F)                | inline an image as a data uri                                                                 |
| [monorule](core/monorule/README.md)                                       | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fmonorule?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                    | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/monorule?labelColor=211F1F)                    | one rule cli to rule them all                                                                 |
| [multipublish](core/multipublish/README.md)                               | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fmultipublish?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/multipublish?labelColor=211F1F)                | Publish packages to multiple providers easily                                                 |
| [pnpm-hooks](core/pnpm-hooks/README.md)                                   | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fpnpm-hooks?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                  | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/pnpm-hooks?labelColor=211F1F)                  | preconfigured pnpm hooks and types for pnpmfile                                               |
| [prettier-plugin-handlebars](core/prettier-plugin-handlebars/README.md)   | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fprettier-plugin-handlebars?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)  | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/prettier-plugin-handlebars?labelColor=211F1F)  | Prettier plugin that automatically assigns the default parser for various handlebars files    |
| [remark-asciinema](core/remark-asciinema/README.md)                       | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fremark-asciinema?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)            | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/remark-asciinema?labelColor=211F1F)            | A remark plugin that transforms Asciinema links into embedded players or screenshots.         |
| [single-file](core/single-file/README.md)                                 | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fsingle-file?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                 | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/single-file?labelColor=211F1F)                 | create a single html file from a website url                                                  |
| [svelte-social-share-links](core/svelte-social-share-links/README.md)     | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Fsvelte-social-share-links?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)   | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/svelte-social-share-links?labelColor=211F1F)   | Svelte/Web component to share the current url with various social media providers             |
| [typed-env](core/typed-env/README.md)                                     | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftyped-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                   | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-env?labelColor=211F1F)                   | standard schema compatible environment validator                                              |
| [typed-events](core/typed-events/README.md)                               | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftyped-events?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-events?labelColor=211F1F)                | Typed events store using standard schema                                                      |
| [typed-nocodb-api](core/typed-nocodb-api/README.md)                       | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftyped-nocodb-api?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)            | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-nocodb-api?labelColor=211F1F)            | Typed API client for NocoDB using Zod                                                         |
| [typed-templates](core/typed-templates/README.md)                         | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftyped-templates?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)             | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-templates?labelColor=211F1F)             | Use standard schema to validate and use handlebar template directories                        |
| [types-github-action-env](core/types-github-action-env/README.md)         | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftypes-github-action-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)     | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/types-github-action-env?labelColor=211F1F)     | environment variable types for GitHub Action environment                                      |
| [types-lhci](core/types-lhci/README.md)                                   | ![npm version image](https://img.shields.io/npm/v/%40stephansama%2Ftypes-lhci?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                  | ![npm downloads](https://img.shields.io/npm/dw/@stephansama/types-lhci?labelColor=211F1F)                  | types for lhci configuration                                                                  |
| [rules](rules/README.md)                                                  | ![npm version image](https://img.shields.io/npm/v/rules?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)                                        | ![npm downloads](https://img.shields.io/npm/dw/rules?labelColor=211F1F)                                    | @stephansama/rules for the packages monorepo                                                  |

<!-- WORKSPACE end -->

<div align="center">

### ☂️ Codecov coverage graph

![graph](https://codecov.io/github/stephansama/packages/graphs/tree.svg)

</div>

## Related repositories

- [stow.nvim](https://github.com/stephansama/stow.nvim)
- [@stephansama/actions](https://github.com/stephansama/actions)
