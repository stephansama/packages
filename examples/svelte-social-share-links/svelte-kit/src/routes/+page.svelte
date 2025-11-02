<script lang="ts">
	import "../app.css";

	import { page } from "$app/state";
	import { SocialShareLink } from "@stephansama/svelte-social-share-links";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
	documentation
</p>

<SocialShareLink url={page.url.href} label="test" network="bluesky" />
<SocialShareLink url={page.url.href} label="test" styled network="bluesky" />
