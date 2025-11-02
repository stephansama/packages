<svelte:options
	customElement={{
		tag: "social-share-link",
		shadow: "none",
		props: {
			hashtags: { type: "String" },
			image: { type: "String" },
			label: { type: "String" },
			network: { type: "String" },
			styled: { type: "Boolean" },
			title: { type: "String" },
			url: { type: "String" },
			user: { type: "String" },
		},
	}}
/>

<script lang="ts">
	import * as networks from "./networks.json" with { type: "json" };

	import type { Network, NetworkSchema } from "./networks";

	const {
		url: currentUrl,
		hashtags,
		image,
		label = "Share",
		network,
		styled,
		title,
		user,
	}: {
		url: string;
		hashtags?: string;
		image?: string;
		label?: string;
		network: Network;
		styled?: boolean;
		title?: string;
		user?: string;
	} = $props();

	const selectedNetwork: NetworkSchema | undefined = networks[network];

	/** @see {https://github.com/stefanobartoletti/nuxt-social-share/blob/311b65871627736f0db8120ecc7e32def78a3b3d/src/runtime/useSocialShare.ts#L45-L64} */
	function buildUrl(selectedNetwork: NetworkSchema) {
		const shareUrl = selectedNetwork.shareUrl;
		const argTitle =
			selectedNetwork.args?.title && title ? selectedNetwork.args?.title : "";
		const argUser =
			selectedNetwork.args?.user && user ? selectedNetwork.args?.user : "";
		const argHashtags =
			selectedNetwork.args?.hashtags && hashtags
				? selectedNetwork.args?.hashtags
				: "";
		const argImage =
			selectedNetwork.args?.image && image ? selectedNetwork.args?.image : "";

		// Replace placeholders with actual values (encode all parameters for URL safety)
		const template = shareUrl + argTitle + argUser + argHashtags + argImage;
		const fullUrl = template
			.replace(/\[u\]/i, encodeURIComponent(currentUrl))
			.replace(/\[t\]/i, encodeURIComponent(title || ""))
			.replace(/\[uid\]/i, encodeURIComponent(user || ""))
			.replace(/\[h\]/i, encodeURIComponent(hashtags || ""))
			.replace(/\[i\]/i, encodeURIComponent(image || ""));

		return new URL(fullUrl).href;
	}
</script>

{#if selectedNetwork}
	<a
		href={buildUrl(selectedNetwork)}
		class={`social-share-button ${styled ? "social-share-button--styled" : ""}`}
		target="_blank"
		style={`--color-brand:${selectedNetwork.color}`}
		aria-label={`Share with ${selectedNetwork.name}`}
	>
		<svg
			class="social-share-button__icon"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			role="img"
			width="1em"
			height="1em"
			viewBox={selectedNetwork.icon.viewBox}
		>
			<path
				fill="currentColor"
				fill-rule="evenodd"
				d={selectedNetwork.icon.path}
			/>
		</svg>
		<span class="social-share-button__label">{label}</span>
	</a>
{/if}

<style>
	@layer components {
		.social-share-button {
			display: flex;
			gap: 0.5em;
			align-items: center;
			text-decoration: none;
			width: min-content;
		}

		.social-share-button__icon {
			font-size: 1.5em;
		}

		.social-share-button--styled {
			--color-hover: color-mix(in srgb, var(--color-brand), #000 15%);
			font-size: 0.875rem;
			line-height: normal;
			padding: 0.5rem;
			color: white;
			border-radius: 0.25rem;
			transition: background-color 0.25s ease-out;
			background-color: var(--color-brand);

			&:hover {
				background-color: var(--color-hover);
			}

			&:focus-visible {
				outline: 2px solid var(--color-brand);
				outline-offset: 2px;
			}

			.social-share-button__label {
				padding: 0 0.5rem;
				white-space: nowrap;
			}
		}
	}
</style>
