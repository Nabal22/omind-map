<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { articles } from '$lib/data/articles';
	import { resolve } from '$app/paths';
	import type { Artist } from '$lib/data/artists';

	interface Props {
		artist: Artist;
	}

	let { artist }: Props = $props();

	const loadedIframes = new SvelteSet<string>();
	const relatedArticles = $derived(articles.filter((a) => a.relatedArtistId === artist.id));

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}
</script>

<div class="font-mono text-black">
	<div class="mb-3 flex items-start gap-3">
		<div class="min-w-0 flex-1">
			<h2 class="text-base font-bold uppercase">
				<a
					href={artist.musicUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-pink no-underline focus-ring transition-opacity duration-150 hover:opacity-60"
				>
					{artist.name}
				</a>
			</h2>
			<p class="mb-2 text-[0.7rem] text-black/50">{artist.country}</p>
			<p class="text-[0.7rem] leading-relaxed text-black/80">
				{artist.description}
			</p>
		</div>
		<img
			src={artist.imageUrl}
			alt={artist.name}
			width="96"
			height="112"
			loading="lazy"
			class="h-28 w-24 shrink-0 object-cover"
			draggable="false"
		/>
	</div>

	{#if artist.soundcloudUrl?.length}
		<div class="mt-4 border-t border-black/10 pt-3">
			<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/50 uppercase">TRACKS</p>
			{#each artist.soundcloudUrl as url (url)}
				<div class="relative mb-1 h-5 py-0.5">
					{#if !loadedIframes.has(url)}
						<div class="absolute inset-0 flex items-center">
							<div class="h-3 w-full animate-pulse rounded-sm bg-black/5"></div>
						</div>
					{/if}
					<iframe
						title="{artist.name} on SoundCloud"
						scrolling="no"
						allow="autoplay"
						width="100%"
						height="20"
						src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaefb&auto_play=false&show_user=false&show_artwork=false`}
						class="transition-opacity duration-300 {loadedIframes.has(url)
							? 'opacity-100'
							: 'opacity-0'}"
						onload={() => handleIframeLoad(url)}
					></iframe>
				</div>
			{/each}
		</div>
	{/if}

	{#if relatedArticles.length}
		<div class="mt-4 border-t border-black/10 pt-3">
			<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/50 uppercase">ARTICLES</p>
			{#each relatedArticles as article (article._id)}
				<a
					href={resolve('/articles/[slug]', { slug: article.slug })}
					class="block py-1.5 text-[0.7rem] text-black/80 focus-ring transition-opacity duration-150 hover:text-pink"
				>
					{article.title}
				</a>
			{/each}
		</div>
	{/if}
</div>
