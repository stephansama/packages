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

	import type { Network, NetworkSchema, UrlProps } from "./networks";

	import { buildUrlFromSchema } from "./networks";

	export interface SocialShareLinkProps extends UrlProps {
		label?: string;
		network: Network;
		styled?: boolean;
	}

	const props: SocialShareLinkProps = $props();

	const selectedNetwork: NetworkSchema | undefined = networks[props.network];

	const label = props.label === undefined ? "Share" : props.label;
	const hasLabel = !!label;
</script>

{#if selectedNetwork}
	<a
		aria-label={`Share with ${selectedNetwork.name}`}
		class:social-share-button--styled={props.styled}
		class="social-share-button"
		href={buildUrlFromSchema(selectedNetwork, props)}
		rel="noreferrer noopener"
		style={`--color-brand:${selectedNetwork.color}`}
		target="_blank"
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
		{#if hasLabel}
			<span class="social-share-button__label">{label}</span>
		{/if}
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
