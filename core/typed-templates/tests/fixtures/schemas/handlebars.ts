import barhandles from "barhandles";

export const handlebarsUser = barhandles.extractSchema(`
{{name}}
{{age}}
{{#each tags}}
	{{this}}
{{/each}}
`);
