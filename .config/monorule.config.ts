import { defineConfig } from "@stephansama/monorule";

export default defineConfig({
	ignorePaths: ["**/node_modules/**", "**/dist/**"],
	ignoreRules: [],
	ruleDirectory: "../rules/src",
	rules: [],
});
