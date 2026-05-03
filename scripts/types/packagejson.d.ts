import type {} from "@manypkg/tools";

declare module "@manypkg/tools" {
	export interface PackageJSON {
		description?: string;
		scripts?: Record<string, string>;
		storybook?: { url: string };
	}
}

export {};
