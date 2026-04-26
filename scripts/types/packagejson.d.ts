import type {} from "@manypkg/tools";

declare module "@manypkg/tools" {
	export interface PackageJSON {
		description?: string;
		storybook?: { url: string };
	}
}

export {};
