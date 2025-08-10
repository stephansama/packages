import type { UserConfig } from "@commitlint/types";

// https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules
const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
};

export default Configuration;
