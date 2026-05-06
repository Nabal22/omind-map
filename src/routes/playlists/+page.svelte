<script lang="ts">
	import { playlists } from '$lib/data/playlists';
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const description =
		'Curated playlists across rage, drain gang, experimental electronic, and UK drill.';

	const itemListJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Playlists',
		itemListElement: playlists.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: `${SITE_URL}/playlists/${p.slug}`,
			name: p.title
		}))
	};
</script>

<svelte:head>
	<title>Playlists — {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Playlists — {SITE_NAME}" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={itemListJsonLd} />

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-8 pb-nav-safe">
		<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">PLAYLISTS</h1>

		{#each playlists as playlist (playlist.id)}
			<a
				href="/playlists/{playlist.slug}"
				class="group block border-b border-black/10 py-8 focus-ring transition-opacity duration-150 first:pt-0"
			>
				<div
					class="mt-4 flex items-center gap-3 text-[0.6rem] tracking-[0.2em] text-black/50 uppercase"
				>
					<span>{playlist.tracks.length} tracks</span>
					<span>·</span>
					<span>{dateFormatter.format(new Date(playlist.createdAt))}</span>
					<span>·</span>
					<span>{playlist.curator}</span>
				</div>

				<h2
					class="mt-2 text-lg font-bold text-pretty uppercase transition-opacity duration-150 group-hover:opacity-70"
				>
					{playlist.title}
				</h2>

				<p class="mt-2 text-[0.75rem] leading-relaxed text-black/80">
					{playlist.description}
				</p>

				<div class="mt-4 flex flex-wrap gap-2">
					{#each playlist.tags as tag (tag)}
						<span
							class="border border-black/10 px-2 py-0.5 text-[0.6rem] tracking-[0.15em] text-black/50 uppercase"
						>
							{tag}
						</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>
