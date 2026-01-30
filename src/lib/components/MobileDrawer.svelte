<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		isOpen: boolean;
		selectedCountry: string | null;
		onClose: () => void;
		onCountrySelect: (country: string | null) => void;
		onFocusCountry: (country: string | null) => void;
	}

	let { isOpen, selectedCountry, onClose, onCountrySelect, onFocusCountry }: Props = $props();

	// Internal state for artist detail view
	let selectedArtist = $state<Artist | null>(null);

	// Cache for loaded iframes
	const loadedIframes = new SvelteSet<string>();

	// Get unique countries from artists
	const countries = [...new Set(artists.map((a) => a.country))].sort();

	// Filter artists based on selected country
	const filteredArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : artists
	);

	function handleCountryClick(country: string) {
		if (selectedCountry === country) {
			onCountrySelect(null);
		} else {
			onCountrySelect(country);
		}
	}

	function handleArtistClick(artist: Artist) {
		selectedArtist = artist;
		onFocusCountry(artist.country);
	}

	function goBackToList() {
		selectedArtist = null;
	}

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	// Reset artist view when drawer closes
	$effect(() => {
		if (!isOpen) {
			selectedArtist = null;
		}
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	></div>

	<!-- Drawer -->
	<nav
		class="fixed bottom-0 left-0 top-0 z-[70] flex w-72 flex-col border-r border-pink/20 bg-black/95 font-mono backdrop-blur-md"
		transition:fly={{ x: -288, duration: 250 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-pink/20 px-4 py-3">
			{#if selectedArtist}
				<button
					class="cursor-pointer border-none bg-transparent p-0 font-mono text-[0.7rem] text-pink opacity-70 transition-all hover:opacity-100"
					onclick={goBackToList}
				>
					← Back
				</button>
			{:else}
				<span class="text-xs uppercase tracking-wider text-pink/70">Artists</span>
			{/if}
			<button
				class="cursor-pointer border-none bg-transparent p-1 text-pink transition-opacity hover:opacity-70"
				onclick={onClose}
				aria-label="Close menu"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		{#if selectedArtist}
			<!-- Artist Detail View -->
			<div class="flex-1 overflow-y-auto p-4" in:fly={{ x: 20, duration: 200 }}>
				<h2 class="mb-3 text-lg font-bold uppercase">
					<a
						href={selectedArtist.musicUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-pink no-underline transition-all duration-200 [text-shadow:0_0_10px_#ffaef6] hover:[text-shadow:0_0_15px_#ffaef6]"
					>
						{selectedArtist.name}
					</a>
				</h2>

				<div class="space-y-2 text-[0.75rem] leading-snug text-pink">
					<p><span class="opacity-50">COUNTRY:</span> {selectedArtist.country}</p>
					<p><span class="opacity-50">BIO:</span> {selectedArtist.description}</p>
				</div>

				{#if selectedArtist.soundcloudUrl?.length}
					<div class="mt-4">
						<p class="mb-2 text-[0.7rem] text-pink"><span class="opacity-50">TOP3:</span></p>
						{#each selectedArtist.soundcloudUrl as url (url)}
							<div class="relative min-h-5 py-0.5">
								{#if !loadedIframes.has(url)}
									<div class="flex items-center">
										<span class="text-[0.6rem] tracking-[0.15em] text-pink opacity-70">LOADING...</span>
									</div>
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
			<!-- Country Filter -->
			<div class="border-b border-pink/20 px-3 py-3">
				<div class="mb-2 text-[0.6rem] uppercase tracking-wider text-pink/50">Filter by country</div>
				<div class="flex flex-wrap gap-1">
					<button
						class="cursor-pointer rounded border border-pink/30 bg-transparent px-2 py-1 font-mono text-[0.65rem] uppercase text-pink transition-all duration-200
							{!selectedCountry ? 'border-pink bg-pink/20 [text-shadow:0_0_8px_#ffaef6]' : 'opacity-60 hover:opacity-100'}"
						onclick={() => onCountrySelect(null)}
					>
						All
					</button>
					{#each countries as country (country)}
						{@const isActive = selectedCountry === country}
						<button
							class="cursor-pointer rounded border border-pink/30 bg-transparent px-2 py-1 font-mono text-[0.65rem] uppercase text-pink transition-all duration-200
								{isActive ? 'border-pink bg-pink/20 [text-shadow:0_0_8px_#ffaef6]' : 'opacity-60 hover:opacity-100'}"
							onclick={() => handleCountryClick(country)}
						>
							{country.length > 10 ? country.slice(0, 8) + '..' : country}
						</button>
					{/each}
				</div>
			</div>

			<!-- Artist List -->
			<div class="flex-1 overflow-y-auto" in:fade={{ duration: 150 }}>
				<ul class="py-2">
					{#each filteredArtists as artist, i (artist.id)}
						<li in:fly={{ x: -20, duration: 200, delay: Math.min(i * 30, 300) }}>
							<button
								class="w-full cursor-pointer border-none border-l-2 border-l-transparent bg-transparent px-4 py-2 text-left font-mono text-sm uppercase text-pink transition-all duration-150 hover:border-l-pink hover:bg-pink/10 hover:pl-5"
								onclick={() => handleArtistClick(artist)}
							>
								{artist.name}
								<span class="block text-[0.6rem] normal-case text-pink/50">{artist.country}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</nav>
{/if}
