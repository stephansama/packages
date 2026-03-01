import type { PlopTypes } from "@turbo/gen";

import { actions, prompts } from "./utils";

/* eslint-disable perfectionist/sort-objects */
export default function generator(plop: PlopTypes.NodePlopAPI) {
	plop.setGenerator("cli", {
		description: "Generate a new cli package",
		prompts: [prompts.name, prompts.description],
		actions: [actions.addTemplate({ type: "cli" }), actions.addAllCommon],
	});

	plop.setGenerator("env", {
		description: "Generate a new env package",
		prompts: [prompts.name, prompts.description],
		actions: [
			actions.addTemplate({ type: "env" }),
			actions.addCommonFile("README.md"),
			actions.addCommonFile("tsconfig.json"),
		],
	});

	plop.setGenerator("lib", {
		description: "Generate a new lib package",
		prompts: [prompts.name, prompts.description],
		actions: [actions.addTemplate({ type: "lib" }), actions.addAllCommon],
	});
}
