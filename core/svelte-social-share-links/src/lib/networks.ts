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

const urlRegexes = {
	hash: /\[h\]/i,
	image: /\[i\]/i,
	title: /\[t\]/i,
	url: /\[u\]/i,
	user: /\[uid\]/i,
};

export function buildUrl(network: Network, props: UrlProps) {
	return buildUrlFromSchema(networks[network], props);
}

/** @see {https://github.com/stefanobartoletti/nuxt-social-share/blob/311b65871627736f0db8120ecc7e32def78a3b3d/src/runtime/useSocialShare.ts#L45-L64} */
export function buildUrlFromSchema(
	{ args, shareUrl }: NetworkSchema,
	props: UrlProps,
) {
	const argumentTitle = args?.title && props.title ? args?.title : "";
	const argumentUser = args?.user && props.user ? args?.user : "";
	const argumentHashtags =
		args?.hashtags && props.hashtags ? args?.hashtags : "";
	const argumentImage = args?.image && props.image ? args?.image : "";

	// Replace placeholders with actual values (encode all parameters for URL safety)
	const template =
		shareUrl +
		argumentTitle +
		argumentUser +
		argumentHashtags +
		argumentImage;
	const fullUrl = template
		.replace(urlRegexes.url, encodeURIComponent(props.url))
		.replace(urlRegexes.title, encodeURIComponent(props.title || ""))
		.replace(urlRegexes.user, encodeURIComponent(props.user || ""))
		.replace(urlRegexes.hash, encodeURIComponent(props.hashtags || ""))
		.replace(urlRegexes.image, encodeURIComponent(props.image || ""));

	return new URL(fullUrl).href;
}
