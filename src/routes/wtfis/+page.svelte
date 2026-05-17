<script lang="ts">
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data } = $props();

	const description =
		'Who The F Is — a video series introducing the underground rap and experimental artists you should know.';

	const itemListJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Who The F Is',
		itemListElement: data.wtfis.map((w, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: `${SITE_URL}/wtfis/${w.slug}`,
			name: `Who The F Is ${w.artist}`
		}))
	});

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	function primaryLink(entry: { instagramUrl?: string; tiktokUrl?: string }) {
		return entry.instagramUrl ?? entry.tiktokUrl ?? '#';
	}
</script>

<svelte:head>
	<title>Who The F Is — {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Who The F Is — {SITE_NAME}" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={itemListJsonLd} />

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-5xl px-4 pt-nav-safe pb-nav-safe sm:px-6 sm:pt-8">
		<div class="mb-8 max-w-2xl">
			<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">
				WHO THE F IS
			</h1>
			<p class="mt-4 text-[0.75rem] leading-relaxed text-black/60">
				{description}
			</p>
		</div>

		<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
			{#each data.wtfis as entry (entry.slug)}
				<li>
					<a
						href={primaryLink(entry)}
						target="_blank"
						rel="noopener noreferrer"
						class="group relative block aspect-[9/16] overflow-hidden border border-black/10 bg-black/5 focus-ring"
						aria-label="Who The F Is {entry.artist} — open on social"
					>
						<img
							src={entry.thumbnail}
							alt="Who The F Is {entry.artist}"
							loading="lazy"
							class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>

						<div
							class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3"
						>
							<div class="text-[0.55rem] tracking-[0.2em] text-white/70 uppercase">
								Who The F Is
							</div>
							<div class="mt-1 text-sm font-bold text-white uppercase">
								{entry.artist}
							</div>
							<div class="mt-1 text-[0.55rem] tracking-[0.15em] text-white/50 uppercase">
								{dateFormatter.format(new Date(entry.publishedAt))}
							</div>
						</div>

						<div
							class="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						>
							{#if entry.instagramUrl}
								<span
									class="rounded-full border border-white/40 bg-black/40 px-2 py-0.5 text-[0.5rem] tracking-[0.15em] text-white uppercase backdrop-blur-sm"
									>IG</span
								>
							{/if}
							{#if entry.tiktokUrl}
								<span
									class="rounded-full border border-white/40 bg-black/40 px-2 py-0.5 text-[0.5rem] tracking-[0.15em] text-white uppercase backdrop-blur-sm"
									>TT</span
								>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
