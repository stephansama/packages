---
name: ai-commit-msg
description: >
  Generate conventional commit messages from staged git diffs using an AI model
  via a prepare-commit-msg Git hook. Configure provider (google, openai, ollama)
  and model via cosmiconfig (ai-commit-msg.config.ts, package.json ai-commit-msg
  key, etc.). Default is ollama/llama2. Requires GOOGLE_GENERATIVE_AI_API_KEY for
  google or OPENAI_API_KEY for openai. Use skipNextRun to bypass a single hook run.
type: core
library: '@stephansama/ai-commit-msg'
library_version: "1.0.0"
sources:
  - stephansama/packages:core/ai-commit-msg/src/index.ts
  - stephansama/packages:core/ai-commit-msg/src/schema.ts
  - stephansama/packages:core/ai-commit-msg/src/config.ts
  - stephansama/packages:core/ai-commit-msg/src/ai.ts
  - stephansama/packages:core/ai-commit-msg/README.md
---

# ai-commit-msg

Writes an AI-generated conventional commit message to the `COMMIT_EDITMSG` file via the `prepare-commit-msg` Git hook. Reads the staged diff and passes it to your configured AI provider.

## Setup

1. Install and initialise husky:

```sh
npm install --save-dev husky && npx husky init
```

2. Create `.husky/prepare-commit-msg`:

```sh
#!/bin/sh
ai-commit-msg -o "$1"
```

3. Create a config file at `ai-commit-msg.config.ts` (or `package.json` key `ai-commit-msg`):

```ts
// ai-commit-msg.config.ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
};
```

4. Set the required environment variable:

```sh
export GOOGLE_GENERATIVE_AI_API_KEY=your-key
```

## Core Patterns

### Google provider

```ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
};
```

Requires `GOOGLE_GENERATIVE_AI_API_KEY` in the environment.

### OpenAI provider

```ts
export default {
  provider: 'openai',
  model: 'gpt-4o-mini',
};
```

Requires `OPENAI_API_KEY` in the environment.

### Ollama provider (local, no API key)

```ts
export default {
  provider: 'ollama',
  model: 'llama3.2',
};
```

Requires the Ollama server running locally (`ollama serve`).

### Custom prompt

```ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
  prompt: 'Write a short conventional commit message in lowercase for this diff:\n\n{{diff}}',
};
```

The `{{diff}}` placeholder is replaced with the staged diff (truncated at 8000 characters). The prompt must include `{{diff}}` or the model receives no diff context.

### Skip the hook for one commit

```ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
  skipNextRun: true,
};
```

When `skipNextRun` is `true`, the hook logs a warning and exits immediately. Remove it from the config after the manual commit.

## Common Mistakes

### CRITICAL Default config uses ollama/llama2 — fails if Ollama not running

Wrong:

```sh
# No config file — hooks use default: provider: 'ollama', model: 'llama2'
# Works locally if ollama is running, fails in CI
```

Correct:

```ts
// ai-commit-msg.config.ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
};
```

Without a config file, `loadConfig` returns `{ provider: 'ollama', model: 'llama2' }`. If the Ollama server is not running, the hook throws a network error and the commit fails. Always provide an explicit config in shared repositories.

Source: `core/ai-commit-msg/src/config.ts:defaultConfig`

### HIGH Missing API key env var for non-ollama providers

Wrong:

```ts
export default { provider: 'google', model: 'gemini-2.5-flash' };
// GOOGLE_GENERATIVE_AI_API_KEY not set in environment
// hook runs: "unable to validate env due to the following issues: ..."
```

Correct:

```sh
# Set in shell profile, .env, or CI secrets
export GOOGLE_GENERATIVE_AI_API_KEY=your-key
```

`getProvider` validates environment variables before constructing the model instance. Google requires `GOOGLE_GENERATIVE_AI_API_KEY`; OpenAI requires `OPENAI_API_KEY`. Missing keys fail with a validation error at hook time.

Source: `core/ai-commit-msg/src/ai.ts:getProvider`

### HIGH Custom prompt missing {{diff}} placeholder

Wrong:

```ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
  prompt: 'Write a short conventional commit message.',
  // no {{diff}} — model has no context
};
```

Correct:

```ts
export default {
  provider: 'google',
  model: 'gemini-2.5-flash',
  prompt: 'Write a short conventional commit message for this diff:\n\n{{diff}}',
};
```

The prompt is processed with `prompt.replace('{{diff}}', diff)`. Without `{{diff}}`, the staged diff is never included and the model generates a generic or empty message.

Source: `core/ai-commit-msg/src/index.ts`

### MEDIUM Running hook with nothing staged

Wrong:

```sh
git commit -m "wip"  # nothing staged → getDiff returns empty string → throws
```

Correct:

```sh
git add src/feature.ts
git commit  # diff is now available
```

`getDiff` runs `git --no-pager diff --staged`. An empty result throws `"unable to get git diff"` and blocks the commit. Stage at least one file before committing, or use `skipNextRun: true` to bypass for manual message commits.

Source: `core/ai-commit-msg/src/index.ts:getDiff`

See also: `auto-readme/SKILL.md` — both packages use Git hooks; the hook setup pattern transfers.
