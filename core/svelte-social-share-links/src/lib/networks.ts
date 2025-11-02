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

export type UrlProps = {
	hashtags?: string;
	image?: string;
	title?: string;
	url: string;
	user?: string;
};

/** @see {https://github.com/stefanobartoletti/nuxt-social-share/blob/311b65871627736f0db8120ecc7e32def78a3b3d/src/runtime/useSocialShare.ts#L45-L64} */
export function buildUrl({ args, shareUrl }: NetworkSchema, props: UrlProps) {
	const argTitle = args?.title && props.title ? args?.title : "";
	const argUser = args?.user && props.user ? args?.user : "";
	const argHashtags = args?.hashtags && props.hashtags ? args?.hashtags : "";
	const argImage = args?.image && props.image ? args?.image : "";

	// Replace placeholders with actual values (encode all parameters for URL safety)
	const template = shareUrl + argTitle + argUser + argHashtags + argImage;
	const fullUrl = template
		.replace(/\[u\]/i, encodeURIComponent(props.url))
		.replace(/\[t\]/i, encodeURIComponent(props.title || ""))
		.replace(/\[uid\]/i, encodeURIComponent(props.user || ""))
		.replace(/\[h\]/i, encodeURIComponent(props.hashtags || ""))
		.replace(/\[i\]/i, encodeURIComponent(props.image || ""));

	return new URL(fullUrl).href;
}
