import * as cp from "node:child_process";

const sh = String.raw;

const flag = process.env.DISABLE_CACHE ? "--cache=local:,remote:" : "";

cp.execSync(sh`turbo build --filter=www ${flag}`, {
	stdio: "inherit",
});
