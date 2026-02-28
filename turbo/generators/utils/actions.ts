import { PlopTypes } from "@turbo/gen";

export function addTemplate({
	type: templateType,
}: {
	type: "cli" | "env" | "lib";
}) {
	return {
		base: `{{turbo.paths.root}}/turbo/generators/templates/${templateType}`,
		destination: `{{ turbo.paths.root }}/core/{{ dashCase name }}`,
		templateFiles: `{{turbo.paths.root}}/turbo/generators/templates/${templateType}/**`,
		type: "addMany",
	} as const satisfies PlopTypes.ActionType;
}

export const addAllCommon = {
	base: `{{ turbo.paths.root }}/turbo/generators/templates/common`,
	destination: `{{turbo.paths.root}}/core/{{dashCase name}}`,
	templateFiles: `{{turbo.paths.root}}/turbo/generators/templates/common/**`,
	type: "addMany",
} as const;

export function addCommonFile<S extends string>(file: S) {
	return {
		path: `{{ turbo.paths.root }}/core/{{ dashCase name }}/${file}`,
		templateFile: `templates/common/${file}`,
		type: "add",
	} as const;
}
