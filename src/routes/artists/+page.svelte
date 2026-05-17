<script lang="ts">
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data } = $props();

	const description = 'Omind curated artist selection.';

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
	<title>Artists — {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Artists — {SITE_NAME}" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={itemListJsonLd} />

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-nav-safe pb-nav-safe sm:pt-8">
		<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">ARTISTS</h1>

		<p class="mt-4 text-[0.75rem] leading-relaxed text-black/60">
			{description}
		</p>

		<ul class="mt-8 divide-y divide-black/10 border-t border-b border-black/10">
			{#each data.artists as artist (artist.id)}
				<li>
					<a
						href="/artists/{artist.id}"
						class="group flex items-baseline justify-between gap-4 py-4 focus-ring transition-opacity duration-150 hover:opacity-70"
					>
						<span class="text-base font-medium">{artist.name}</span>
						<span class="text-[0.6rem] tracking-[0.1em] text-black/50 uppercase"
							>{artist.country}</span
						>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
