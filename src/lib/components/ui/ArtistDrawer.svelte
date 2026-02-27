<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { beforeNavigate } from '$app/navigation';
	import { getSelectedArtist, closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import { articles } from '$lib/data/articles';
	import { resolve } from '$app/paths';

	const loadedIframes = new SvelteSet<string>();

	let artist = $derived(getSelectedArtist());
	let relatedArticles = $derived(
		artist ? articles.filter((a) => a.relatedArtistId === artist.id) : []
	);

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	// Close on page navigation
	beforeNavigate(() => {
		closeArtistDrawer();
	});

	// Close on Escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && artist) {
			closeArtistDrawer();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if artist}
	<!-- Mobile backdrop (hidden on desktop) -->
	<button
		class="fixed inset-0 z-[70] border-none bg-black/30 p-0 sm:hidden"
		transition:fade={{ duration: 150 }}
		onclick={closeArtistDrawer}
		aria-label="Close artist drawer"
	></button>

	<!-- Mobile: bottom drawer / Desktop: top-left panel -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-x-0 bottom-0 z-[71] max-h-[50vh] overflow-y-auto border-t border-black/10 bg-white font-mono text-black sm:inset-auto sm:top-6 sm:left-6 sm:max-h-none sm:max-w-sm sm:border sm:border-black/10"
		transition:fly={{ y: 300, duration: 200 }}
		onclick={(e) => e.stopPropagation()}
		ontouchstart={(e) => e.stopPropagation()}
		ontouchend={(e) => e.stopPropagation()}
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar (mobile only) -->
		<div class="flex justify-center py-2 sm:hidden">
			<div class="h-px w-10 bg-black/10"></div>
		</div>

		<div class="px-4 pb-6 sm:pt-4">
			<button
				class="mb-3 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.65rem] tracking-[0.15em] text-black/40 uppercase transition-opacity duration-150 hover:text-pink"
				onclick={closeArtistDrawer}
			>
				CLOSE
			</button>

			<div class="mb-3 flex items-center gap-3">
				<img
					src={artist.imageUrl}
					alt={artist.name}
					class="h-14 w-14 shrink-0 object-cover sm:h-12 sm:w-12"
					draggable="false"
				/>
				<div>
					<h2 class="text-base font-bold tracking-[0.1em] uppercase">
						<a
							href={artist.musicUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-pink no-underline transition-opacity duration-150 hover:opacity-60"
						>
							{artist.name}
						</a>
					</h2>
					<p class="text-[0.7rem] text-black/30">{artist.country}</p>
				</div>
			</div>

			<p class="text-[0.7rem] leading-relaxed text-black/60">{artist.description}</p>

			{#if artist.soundcloudUrl?.length}
				<div class="mt-4 border-t border-black/10 pt-3">
					<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/30 uppercase">TRACKS</p>
					{#each artist.soundcloudUrl as url (url)}
						<div class="relative h-5 py-0.5 mb-1">
							{#if !loadedIframes.has(url)}
								<span class="absolute text-[0.6rem] tracking-[0.1em] text-black/20">LOADING</span>
							{/if}
							<iframe
								title="{artist.name} on SoundCloud"
								scrolling="no"
								allow="autoplay"
								width="100%"
								height="20"
								src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaefb&auto_play=false&show_user=false&show_artwork=false`}
								class="transition-opacity duration-200 {loadedIframes.has(url)
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
					<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/30 uppercase">ARTICLES</p>
					{#each relatedArticles as article (article._id)}
						<a
							href={resolve('/articles/[slug]', { slug: article.slug })}
							class="block py-1.5 text-[0.7rem] text-black/60 transition-opacity duration-150 hover:text-pink"
						>
							{article.title}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
