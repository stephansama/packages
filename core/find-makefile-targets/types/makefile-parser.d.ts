declare module "@kba/makefile-parser" {
	type MakefileAST = {
		comment?: string;
		deps?: string;
		recipe?: string;
		target?: string;
		value?: string;
		variable?: string;
	};

	type ParserResponse = {
		ast: MakefileAST[];
		PHONY: unknown[];
		unhandled: unknown[];
	};

	const parser: (file: string) => ParserResponse;

	export default parser;
}
