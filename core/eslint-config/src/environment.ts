// based on sxzz https://github.com/sxzz/eslint-config/blob/cc49fe78c03d53bd8c1923ab6d3a4adb1c348119/src/env.ts
// based on antfu https://github.com/antfu/eslint-config/blob/8d25a37e3e0c5776796ff042265889fc1657bcd5/src/utils.ts#L119
import { resolveModule } from "local-pkg";
import * as process from "node:process";

export async function ensurePackages(...packages: string[]): Promise<void> {
	const nonExistingPackages = packages.filter((pkg): pkg is string => {
		return (pkg && !hasPackage(pkg)) || false;
	});

	if (isDebugging()) {
		console.info("ensuring", packages);
		console.info(nonExistingPackages);
	}

	if (nonExistingPackages.length === 0) return;

	if (isInEditorEnvironment()) return;

	const prompts = await import("@clack/prompts");

	const result = await prompts.confirm({
		message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
	});

	if (!result) return;

	await import("@antfu/install-pkg").then((pkg) => {
		return pkg.installPackage(nonExistingPackages, { dev: true });
	});
}

export function hasPackage(name: string) {
	return !!resolveModule(name);
}

export async function interopDefault<T>(
	m: Promise<T> | T,
): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await m;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
	return (resolved as any).default || resolved;
}

export function isDebugging() {
	if (isInEditorEnvironment()) return false;
	return process.env.DEBUG;
}

export function isInEditorEnvironment() {
	if (process.env.CI) return false;
	if (isInGitHooksOrLintStaged()) return false;
	return !!(
		process.env.VSCODE_PID ||
		process.env.VSCODE_CWD ||
		process.env.JETBRAINS_IDE ||
		process.env.VIM ||
		process.env.NVIM
	);
}

export function isInGitHooksOrLintStaged() {
	return !!(
		process.env.GIT_PARAMS ||
		process.env.VSCODE_GIT_COMMAND ||
		["nano-staged", "lint-staged"].some((item) => {
			return process.env.npm_lifecycle_script?.startsWith(item);
		})
	);
}
