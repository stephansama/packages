import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI) {
	plop.setGenerator("package", {
		description: "Generate a new package",
		prompts: [
			{
				message: "What is the name of the new package?",
				name: "name",
				type: "input",
				validate(input: string) {
					if (input.includes(".")) {
						return "library name cannot include an extension";
					}
					if (input.includes(" ")) {
						return "library name cannot include spaces";
					}
					if (!input) {
						return "library name is required";
					}
					return true;
				},
			},
			{
				message: "What is the description of the new package?",
				name: "description",
				type: "input",
			},
		],
		// eslint-disable-next-line
		actions: [
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/package.json",
				templateFile: "templates/lib/package.json.hbs",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/README.md",
				templateFile: "templates/lib/README.md.hbs",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/tsup.config.ts",
				templateFile: "templates/lib/tsup.config.ts",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/tsconfig.json",
				templateFile: "templates/lib/tsconfig.json",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/vitest.config.ts",
				templateFile: "templates/lib/vitest.config.ts",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/typedoc.json",
				templateFile: "templates/lib/typedoc.json",
				type: "add",
			},
			{
				path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/src/index.ts",
				templateFile: "templates/lib/BLANK",
				type: "add",
			},
		],
	});
}
