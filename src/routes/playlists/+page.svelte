<script lang="ts">
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import { platformLabel, type Playlist } from '$lib/data/playlists';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data } = $props();

	const description =
		'Curated playlists and radio mixes by Omind — yearly best-of, monthly worldwide selections, and guest radio mixes. Stream on Spotify, Apple Music, YouTube, SoundCloud, and Deezer.';

	const playlistsList = $derived(data.playlists.filter((p) => p.type === 'playlist'));
	const radioList = $derived(data.playlists.filter((p) => p.type === 'radio'));

	const itemListJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Playlists & Radio',
		itemListElement: data.playlists.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: p.links[0]?.url,
			name: p.title
		}))
	});

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>Playlists & Radio — {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Playlists & Radio — {SITE_NAME}" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={itemListJsonLd} />

{#snippet card(item: Playlist)}
	<li class="flex flex-col">
		<a
			href={item.links[0]?.url ?? '#'}
			target="_blank"
			rel="noopener noreferrer"
			class="group relative block aspect-square overflow-hidden border border-black/10 bg-black/5 focus-ring"
			aria-label="{item.title} — open on {platformLabel(item.links[0].platform)}"
		>
			<img
				src={item.thumbnail}
				alt={item.title}
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</a>

		<div class="mt-3">
			<h3 class="text-sm font-bold tracking-[0.05em] text-pretty uppercase">
				{item.title}
			</h3>
			{#if item.publishedAt}
				<p class="mt-1 text-[0.55rem] tracking-[0.2em] text-black/40 uppercase">
					{dateFormatter.format(new Date(item.publishedAt))}
				</p>
			{/if}
			{#if item.description}
				<p class="mt-2 text-[0.7rem] leading-relaxed text-black/60">
					{item.description}
				</p>
			{/if}

			<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
				{#each item.links as link (link.url)}
					<li>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-[0.6rem] tracking-[0.2em] text-black uppercase underline underline-offset-4 focus-ring transition-colors duration-150 hover:text-pink"
						>
							{platformLabel(link.platform)}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</li>
{/snippet}

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-5xl px-4 pt-nav-safe pb-nav-safe sm:px-6 sm:pt-8">
		<div class="mb-8 max-w-2xl">
			<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">
				PLAYLISTS &amp; RADIO
			</h1>
		</div>

		<section class="mb-12">
			<h2 class="mb-4 text-xs font-bold tracking-[0.2em] text-black/50 uppercase">PLAYLISTS</h2>
			<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
				{#each playlistsList as p (p.slug)}
					{@render card(p)}
				{/each}
			</ul>
		</section>

		<section>
			<h2 class="mb-4 text-xs font-bold tracking-[0.2em] text-black/50 uppercase">RADIO</h2>
			<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
				{#each radioList as r (r.slug)}
					{@render card(r)}
				{/each}
			</ul>
		</section>
	</div>
</div>
