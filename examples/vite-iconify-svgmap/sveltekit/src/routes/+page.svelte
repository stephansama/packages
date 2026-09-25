<script lang="ts">
	import { Icon } from "@stephansama/vite-iconify-svgmap/svelte";
	import { getIcon } from "virtual:iconify-svgmap";
	import astro from "virtual:iconify-svgmap/logos/astro";
	import copilot from "virtual:iconify-svgmap/octicon/copilot-16";

	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();
</script>

<h1>Static imports</h1>
{#each [astro, copilot] as href (href)}
	<svg><use {href}></use></svg>
{/each}

<h1>Rendered with getIcon</h1>
{#each data.icons as [pack, name] (name)}
	<svg><use href={getIcon(pack, name)}></use></svg>
{/each}

<h1>Svelte Icon component</h1>
<Icon name="svelte-icon" pack="logos" title="Svelte" />
<Icon class="accent" name="star-solid" pack="heroicons" />

<style>
	:global(.accent) {
		color: goldenrod;
	}
</style>
