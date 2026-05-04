<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config';
	import { focusOnArtist } from '$lib/stores/explore.svelte';
	import { closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	let { data } = $props();
	let artist = $derived(data.artist);

	// URL → state sync: open the drawer + focus globe when this page mounts.
	// Cleanup on unmount/navigation away clears just the artist (preserves country
	// so swiping right back to / shows the country list).
	$effect(() => {
		if (artist) focusOnArtist(artist);
		return () => closeArtistDrawer();
	});
</script>

<svelte:head>
	<title>{artist.name} — {SITE_NAME}</title>
	<meta name="description" content={artist.description} />
	<meta property="og:title" content={artist.name} />
	<meta property="og:description" content={artist.description} />
	<meta property="og:image" content="{SITE_URL}{artist.imageUrl}" />
	<meta property="og:type" content="profile" />
	<meta property="profile:username" content={artist.name} />
</svelte:head>

<!-- SEO content for crawlers (visually hidden — the globe + sheet/drawer overlay this on screen) -->
<div class="sr-only">
	<h1>{artist.name}</h1>
	<p>Country: {artist.country}</p>
	<p>{artist.description}</p>
	{#if artist.musicUrl}
		<a href={artist.musicUrl} rel="noopener">{artist.name} on SoundCloud</a>
	{/if}
</div>
