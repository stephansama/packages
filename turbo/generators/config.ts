import type { PlopTypes } from "@turbo/gen";

import { actions, prompts } from "./utils";

export default function generator(plop: PlopTypes.NodePlopAPI) {
	plop.setGenerator("cli", {
		description: "Generate a new cli package",
		prompts: [
			prompts.name,
			prompts.description,
			prompts.schema,
			prompts.snapshot,
		],
		actions(data) {
			if (!data) throw new Error("unable to find original answers");
			data.bin = true;
			data.build = true;
			return [actions.addTemplate({ type: "cli" }), actions.addAllCommon];
		},
	});

	plop.setGenerator("env", {
		description: "Generate a new env package",
		prompts: [prompts.name, prompts.description, prompts.schema],
		actions(data) {
			if (!data) throw new Error("unable to find original answers");
			return [
				actions.addTemplate({ type: "env" }),
				actions.addCommonFile("README.md"),
				actions.addCommonFile("tsconfig.json"),
			];
		},
	});

	plop.setGenerator("lib", {
		description: "Generate a new lib package",
		prompts: [
			prompts.name,
			prompts.description,
			prompts.schema,
			prompts.snapshot,
		],
		actions(data) {
			if (!data) throw new Error("unable to find original answers");
			data.build = true;
			return [actions.addTemplate({ type: "lib" }), actions.addAllCommon];
		},
	});
}
