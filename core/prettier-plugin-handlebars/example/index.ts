import type { Config } from "prettier";

import prettierPluginHandlebars from "../dist/index.cjs";

export default {
	plugins: [prettierPluginHandlebars],
} satisfies Config;
