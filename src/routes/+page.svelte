<script lang="ts">
	import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data } = $props();

	const websiteJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: SITE_URL
	};

	const itemListJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Artists',
		itemListElement: data.artists.map((a, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: `${SITE_URL}/artists/${a.id}`,
			name: a.name
		}))
	});
</script>

<svelte:head>
	<title>{SITE_NAME} — underground rap, electronic, experimental</title>
	<meta name="description" content={SITE_DESCRIPTION} />
	<meta property="og:title" content="{SITE_NAME} — underground rap, electronic, experimental" />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={websiteJsonLd} />
<JsonLd data={itemListJsonLd} />

<!-- Globe is rendered in +layout.svelte. This block is invisible (sr-only) but
     crawlable so the home route has indexable content. -->
<section class="sr-only">
	<h1>{SITE_NAME}</h1>
	<p>{SITE_DESCRIPTION}</p>

	<h2>Artists</h2>
	<ul>
		{#each data.artists as artist (artist.id)}
			<li>
				<a href="/artists/{artist.id}">{artist.name}</a> — {artist.country}
			</li>
		{/each}
	</ul>

	<h2>Countries</h2>
	<ul>
		{#each data.countries as country (country)}
			<li>{country}</li>
		{/each}
	</ul>

	<h2>Sections</h2>
	<ul>
		<li><a href="/articles">Articles</a></li>
		<li><a href="/playlists">Playlists</a></li>
		<li><a href="/artists">Artists</a></li>
	</ul>
</section>
