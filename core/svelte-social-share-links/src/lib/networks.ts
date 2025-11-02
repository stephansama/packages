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
export function buildUrl(selectedNetwork: NetworkSchema, props: UrlProps) {
	const { shareUrl } = selectedNetwork;
	const argTitle =
		selectedNetwork.args?.title && props.title
			? selectedNetwork.args?.title
			: "";
	const argUser =
		selectedNetwork.args?.user && props.user
			? selectedNetwork.args?.user
			: "";
	const argHashtags =
		selectedNetwork.args?.hashtags && props.hashtags
			? selectedNetwork.args?.hashtags
			: "";
	const argImage =
		selectedNetwork.args?.image && props.image
			? selectedNetwork.args?.image
			: "";

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
