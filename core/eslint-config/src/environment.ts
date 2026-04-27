// based on sxzz https://github.com/sxzz/eslint-config/blob/cc49fe78c03d53bd8c1923ab6d3a4adb1c348119/src/env.ts
import * as module from "node:module";
import * as process from "node:process";

const cwd = process.cwd();

export function hasPackage(name: string) {
	const require = module.createRequire(`${process.cwd()}/`);
	try {
		require.resolve(name, { paths: [cwd] });
		return true;
	} catch {
		return false;
	}
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
		process.env.npm_lifecycle_script?.startsWith("nano-staged") ||
		process.env.npm_lifecycle_script?.startsWith("lint-staged")
	);
}
