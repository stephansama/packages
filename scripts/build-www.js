import * as cp from "node:child_process";

const disable = process.env.DISABLE_CACHE;
const sh = String.raw;

const flag = disable ? "--cache=local:,remote:" : "";

cp.execSync(sh`turbo build --filter=www ${flag}`, {
	stdio: "inherit",
});
