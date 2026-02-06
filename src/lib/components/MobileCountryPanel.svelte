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
	<!-- Backdrop - subtle, doesn't block globe interaction much -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40"
		transition:fade={{ duration: 150 }}
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	></div>

	<!-- Bottom Panel -->
	<div
		class="fixed bottom-0 left-0 right-0 z-50 max-h-[45vh] overflow-hidden rounded-t-2xl border-t border-pink/30 bg-black/90 font-mono backdrop-blur-md"
		transition:fly={{ y: 300, duration: 250 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar -->
		<div class="flex justify-center py-2">
			<div class="h-1 w-12 rounded-full bg-pink/30"></div>
		</div>

		{#if selectedArtist}
			<!-- Artist Detail View -->
			<div class="overflow-y-auto px-4 pb-6" style="max-height: calc(45vh - 40px);" in:fly={{ x: 20, duration: 200 }}>
				<button
					class="mb-2 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.7rem] text-pink opacity-70 transition-all hover:opacity-100"
					onclick={goBackToList}
				>
					← Back to {selectedCountry}
				</button>

				<h2 class="mb-2 text-base font-bold uppercase">
					<a
						href={selectedArtist.musicUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-pink no-underline [text-shadow:0_0_10px_#ffaef6]"
					>
						{selectedArtist.name}
					</a>
				</h2>

				<p class="mb-3 text-[0.7rem] leading-relaxed text-pink/80">
					{selectedArtist.description}
				</p>

				{#if selectedArtist.soundcloudUrl?.length}
					<div>
						<p class="mb-1 text-[0.6rem] text-pink/50">TRACKS:</p>
						{#each selectedArtist.soundcloudUrl as url (url)}
							<div class="relative min-h-5 py-0.5">
								{#if !loadedIframes.has(url)}
									<span class="text-[0.55rem] tracking-wider text-pink/50">loading...</span>
								{/if}
								<iframe
									title="{selectedArtist.name} on SoundCloud"
									scrolling="no"
									allow="autoplay"
									width="100%"
									height="20"
									src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaef6&auto_play=false&show_user=false&show_artwork=false`}
									class="transition-opacity duration-300 {loadedIframes.has(url) ? 'opacity-100' : 'opacity-0'}"
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
					<h3 class="text-sm font-bold uppercase text-pink [text-shadow:0_0_8px_#ffaef6]">
						{selectedCountry}
					</h3>
					<span class="text-[0.65rem] text-pink/50">{countryArtists.length} artist{countryArtists.length > 1 ? 's' : ''}</span>
				</div>

				<div class="overflow-y-auto" style="max-height: calc(45vh - 100px);">
					<ul class="space-y-1">
						{#each countryArtists as artist, i (artist.id)}
							<li in:fly={{ y: 10, duration: 150, delay: i * 50 }}>
								<button
									class="w-full cursor-pointer rounded-lg border border-pink/20 bg-pink/5 px-3 py-2 text-left font-mono transition-all duration-150 hover:border-pink/40 hover:bg-pink/10"
									onclick={() => handleArtistClick(artist)}
								>
									<span class="block text-sm uppercase text-pink">{artist.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
{/if}
