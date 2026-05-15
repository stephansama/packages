import type {} from "@manypkg/tools";

declare module "@manypkg/tools" {
	export interface PackageJSON {
		bin?: Record<string, string> | string;
		description?: string;
		files: Array<string>;
		scripts?: Record<string, string>;
		storybook?: { url: string };
	}
}

export {};
