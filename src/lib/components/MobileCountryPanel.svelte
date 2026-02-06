<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onClose: () => void;
	}

	let { selectedCountry, onClose }: Props = $props();

	// Internal state for artist detail view
	let selectedArtist = $state<Artist | null>(null);

	// Cache for loaded iframes
	const loadedIframes = new SvelteSet<string>();

	// Filter artists for selected country
	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);

	function handleArtistClick(artist: Artist) {
		selectedArtist = artist;
	}

	function goBackToList() {
		selectedArtist = null;
	}

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	// Reset artist view when country changes
	$effect(() => {
		selectedCountry;
		selectedArtist = null;
	});
</script>

{#if selectedCountry}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40"
		transition:fade={{ duration: 100 }}
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	></div>

	<!-- Bottom Panel -->
	<div
		class="fixed bottom-0 left-0 right-0 z-50 max-h-[45vh] overflow-hidden border-t border-pink/10 bg-black font-mono"
		transition:fly={{ y: 300, duration: 200 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar -->
		<div class="flex justify-center py-2">
			<div class="h-px w-10 bg-pink/20"></div>
		</div>

		{#if selectedArtist}
			<!-- Artist Detail View -->
			<div class="overflow-y-auto px-4 pb-6" style="max-height: calc(45vh - 40px);" in:fly={{ x: 20, duration: 150 }}>
				<button
					class="mb-2 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-pink/40 transition-opacity duration-150 hover:text-pink"
					onclick={goBackToList}
				>
					BACK
				</button>

				<h2 class="mb-2 text-sm font-normal uppercase tracking-[0.1em]">
					<a
						href={selectedArtist.musicUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-pink no-underline"
					>
						{selectedArtist.name}
					</a>
				</h2>

				<p class="mb-3 text-[0.65rem] leading-relaxed text-pink/50">
					{selectedArtist.description}
				</p>

				{#if selectedArtist.soundcloudUrl?.length}
					<div class="border-t border-pink/10 pt-2">
						<p class="mb-1 text-[0.55rem] uppercase tracking-[0.15em] text-pink/30">TRACKS</p>
						{#each selectedArtist.soundcloudUrl as url (url)}
							<div class="relative min-h-5 py-0.5">
								{#if !loadedIframes.has(url)}
									<span class="text-[0.55rem] tracking-[0.1em] text-pink/20">LOADING</span>
								{/if}
								<iframe
									title="{selectedArtist.name} on SoundCloud"
									scrolling="no"
									allow="autoplay"
									width="100%"
									height="20"
									src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffffff&auto_play=false&show_user=false&show_artwork=false`}
									class="transition-opacity duration-200 {loadedIframes.has(url) ? 'opacity-100' : 'opacity-0'}"
									onload={() => handleIframeLoad(url)}
								></iframe>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Country Header + Artist List -->
			<div class="px-4 pb-4">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-xs font-normal uppercase tracking-[0.15em] text-pink">
						{selectedCountry}
					</h3>
					<span class="text-[0.6rem] text-pink/30">{countryArtists.length}</span>
				</div>

				<div class="overflow-y-auto" style="max-height: calc(45vh - 100px);">
					<ul class="space-y-0">
						{#each countryArtists as artist, i (artist.id)}
							<li in:fly={{ y: 8, duration: 120, delay: i * 40 }}>
								<button
									class="w-full cursor-pointer border-b border-pink/5 bg-transparent px-0 py-2.5 text-left font-mono transition-opacity duration-150 hover:opacity-60"
									onclick={() => handleArtistClick(artist)}
								>
									<span class="block text-xs uppercase tracking-[0.05em] text-pink">{artist.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
{/if}
