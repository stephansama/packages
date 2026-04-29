import { getPackages } from "@manypkg/get-packages";
import * as cp from "node:child_process";

const { packages } = await getPackages(process.cwd());

for (const pkg of packages) {
	const lintScript = pkg.packageJson.scripts?.["lint"] || "eslint ./";

	cp.execFileSync(
		"npm",
		["pkg", "set", `scripts.lint:fix=${lintScript} --fix`],
		{
			cwd: pkg.dir,
			stdio: "inherit",
		},
	);
}
