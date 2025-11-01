import * as networks from "./networks.json" with { type: "json" };

export type Network = keyof typeof networks;

export type NetworkSchema = {
	args?: {
		hashtags?: string;
		image?: string;
		title?: string;
		user?: string;
	};
	color: string;
	icon: {
		path: string;
		viewBox: string;
	};
	name: string;
	shareUrl: string;
};
