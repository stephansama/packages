<script lang="ts">
	import type { Snippet } from "svelte";

	const { children }: { children: Snippet } = $props();
</script>

<nav>
	<a href="/">home</a>
	<a href="/nested">nested</a>
</nav>

{@render children()}

<style>
	:global(svg) {
		height: 48px;
		width: 48px;
	}
</style>
