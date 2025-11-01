<script lang="ts">
	import { SocialShareLink } from "@stephansama/svelte-social-share-links";
	const { url }: { url: string } = $props();
</script>

<SocialShareLink styled {url} network="bluesky" />
