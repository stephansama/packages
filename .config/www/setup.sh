#!/usr/bin/env sh

pnpm --workspace-root run scripts:generate-examples

pnpm exec typedoc

pnpm exec eslint-config-inspector build --base /eslint --outDir public/eslint

pnpm exec node-modules-inspector build --base /node_modules --outDir public/node_modules

node -e "console.log(JSON.stringify({message: Date.now()}))" >public/healthcheck.json

pnpm --workspace-root run scripts:meta >public/meta.json

pnpm --workspace-root run scripts:storybook
