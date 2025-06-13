import { $ as sh } from "zx";

import root from "../../../package.json" with { type: "json" };

await sh`../../node_modules/.bin/typedoc`;

const branch = process.env.GITHUB_HEAD_REF || "main";
const { site } = root.config;

/** @see https://developers.cloudflare.com/workers/wrangler/commands/#deploy-1 */
await sh`
node_modules/.bin/wrangler pages deploy ../../dist --branch=${branch} --project-name=${site} --commit-dirty=true
`;
