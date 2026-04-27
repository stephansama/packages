#!/usr/bin/env sh

pnpm --filter=scripts generate-examples

pnpm exec typedoc

pnpm exec eslint-config-inspector build --base /eslint --outDir public/eslint

pnpm exec node-modules-inspector build --base /node_modules --outDir public/node_modules

node -e "console.log(JSON.stringify({message: Date.now()}))" >public/healthcheck.json

pnpm --filter=scripts meta >public/meta.json

pnpm --filter=scripts storybook
