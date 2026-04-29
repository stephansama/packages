import dedent from "dedent";
import * as cp from "node:child_process";
import * as process from "node:process";

export const MODULE_NAME = "multipublish" as const;
export const JSR_CONFIG_FILENAME = "jsr.json" as const;

export async function chdir(
	newDirectory: string,
	callback: () => Promise<void> | void,
) {
	const cwd = process.cwd();
	try {
		process.chdir(newDirectory);
		await callback();
	} catch (error) {
		console.error(error);
	} finally {
		process.chdir(cwd);
	}
}

export function gitClean(filename: string) {
	cp.execFileSync("git", ["clean", "-f", "--", filename], {
		stdio: "inherit",
	});
}

export function npmrcTemplate(options: {
	authToken: string;
	registry: string;
	registryDomain: string;
	scope: string;
}) {
	return dedent`
	{{SCOPE}}:registry={{REGISTRY}}
	//{{REGISTRY_DOMAIN}}/:_authToken={{AUTH_TOKEN}}
	`
		.replace("{{AUTH_TOKEN}}", options.authToken)
		.replace("{{REGISTRY}}", options.registry)
		.replace("{{REGISTRY_DOMAIN}}", options.registryDomain)
		.replace("{{SCOPE}}", options.scope);
}

export async function readStdin() {
	process.stdin.setEncoding("utf8");
	if (process.stdin.isTTY) return;
	let chunks = "";
	for await (const chunk of process.stdin) chunks += chunk;
	return chunks;
}
