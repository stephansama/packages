#!/usr/bin/env sh

./node_modules/.bin/typedoc

./node_modules/.bin/eslint-config-inspector build --base /eslint --outDir public/eslint

./node_modules/.bin/node-modules-inspector build --base /node_modules --outDir public/node_modules

node -e "console.log(JSON.stringify({message: Date.now()}))" >public/healthcheck.json
