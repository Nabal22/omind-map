<script lang="ts">
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import { focusOnArtist } from '$lib/stores/explore.svelte';
	import { closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data } = $props();
	let artist = $derived(data.artist);

	const ogImage = $derived(
		artist.imageUrl ? `${SITE_URL}${artist.imageUrl}` : `${SITE_URL}${OG_IMAGE}`
	);

	const musicGroupJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'MusicGroup',
		name: artist.name,
		description: artist.description,
		url: `${SITE_URL}/artists/${artist.id}`,
		image: ogImage,
		sameAs: [artist.musicUrl, ...(artist.soundcloudUrl ?? [])].filter(Boolean)
	});

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
			{ '@type': 'ListItem', position: 2, name: 'Artists', item: `${SITE_URL}/artists` },
			{
				'@type': 'ListItem',
				position: 3,
				name: artist.name,
				item: `${SITE_URL}/artists/${artist.id}`
			}
		]
	});

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
	<meta property="og:image" content={ogImage} />
	<meta property="og:type" content="profile" />
	<meta property="profile:username" content={artist.name} />
</svelte:head>

<JsonLd data={musicGroupJsonLd} />
<JsonLd data={breadcrumbJsonLd} />

<!-- SEO content for crawlers (visually hidden — the globe + sheet/drawer overlay this on screen) -->
<div class="sr-only">
	<h1>{artist.name}</h1>
	<p>Country: {artist.country}</p>
	<p>{artist.description}</p>
	{#if artist.musicUrl}
		<a href={artist.musicUrl} rel="noopener">{artist.name} on SoundCloud</a>
	{/if}
</div>
