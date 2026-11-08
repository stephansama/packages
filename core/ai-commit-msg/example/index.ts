import type { Config } from "@stephansama/ai-commit-msg/schema";

// remark-usage-ignore-next 2
import * as fs from "node:fs";
import path from "node:path";

// Save a config file as `ai-commit-msg.config.ts` in the project root (any
// cosmiconfig location works, e.g. an `ai-commit-msg` key in `package.json`):

export default {
	model: "claude-opus-5-5",
	provider: "anthropic",
} satisfies Config;

// Then set the API key for the provider. Anthropic reads
// `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_OAUTH_TOKEN`, or `ANTHROPIC_API_KEY`.
//
// The CLI writes the generated message to the file passed with `-o`. Run it
// from the `prepare-commit-msg` git hook, which receives the commit message
// file as its first argument.
//
// ### Husky
//
// Install and initialize husky with
// `pnpm add -D husky && pnpm exec husky init`, then create
// `.husky/prepare-commit-msg`:

console.log("sh", read(".husky/prepare-commit-msg"));

// ### Lefthook
//
// Install lefthook with `pnpm add -D lefthook`, add the hook to `lefthook.yml`
// (`{1}` is the first git hook argument, the commit message file), then run
// `pnpm exec lefthook install`:

console.log("yaml", read("lefthook.yml"));

// ### Preserving your commit message
//
// If the output file already contains a message (for example from
// `git commit -m "fix login redirect"`), it is passed to the model as the
// original intent. The message is then rewritten to match the prompt's format
// and the staged diff, without changing what it means.
//
// Git comment lines (`#`) and verbose diff output are ignored. A message that
// is empty, punctuation only, or a variant of `n/a` (`N/A`, `na`, `n.a.`,
// `none`) is treated as no message, and a fresh one is generated from the diff.
//
// A custom `prompt` can place the existing message with the `{{message}}`
// placeholder. Without the placeholder, intent instructions are appended to the
// prompt when a message exists.

// remark-usage-ignore-next 3
function read(file: string) {
	return fs.readFileSync(path.join(import.meta.dirname, file), "utf8").trim();
}
