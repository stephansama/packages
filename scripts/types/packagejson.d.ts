import "@manypkg/tools";

declare module "@manypkg/tools" {
	export interface PackageJSON {
		description: string;
		storybook: { url: string };
	}
}

export {};
