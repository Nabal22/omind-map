<script lang="ts">
	import { fly } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		selectedArtist: Artist | null;
		onClose: () => void;
		onArtistSelect: (artist: Artist | null) => void;
	}

	let { selectedCountry, selectedArtist, onClose, onArtistSelect }: Props = $props();

	// Cache for loaded iframes
	const loadedIframes = new SvelteSet<string>();

	// Filter artists for selected country
	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);

	// Tap-outside detection: close on tap, ignore swipes
	let panelEl = $state<HTMLElement | null>(null);
	let touchStart = { x: 0, y: 0 };
	let tracking = false;

	function handleDocTouchStart(e: TouchEvent) {
		if (!selectedCountry) return;
		if (panelEl?.contains(e.target as Node)) return;
		const t = e.touches[0];
		touchStart = { x: t.clientX, y: t.clientY };
		tracking = true;
	}

	function handleDocTouchEnd(e: TouchEvent) {
		if (!tracking) return;
		tracking = false;
		const t = e.changedTouches[0];
		const dx = Math.abs(t.clientX - touchStart.x);
		const dy = Math.abs(t.clientY - touchStart.y);
		if (dx < 10 && dy < 10) onClose();
	}

	function handleArtistClick(artist: Artist) {
		onArtistSelect(artist);
	}

	function goBackToList() {
		onArtistSelect(null);
	}

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	// Keyboard navigation
	let focusedIndex = $state(-1);

	// Reset focused index when artist list changes
	$effect(() => {
		countryArtists;
		focusedIndex = -1;
	});

	// Auto-focus panel on mount
	$effect(() => {
		if (selectedCountry && panelEl) {
			requestAnimationFrame(() => panelEl?.focus());
		}
	});

	function handlePanelKeydown(e: KeyboardEvent) {
		if (selectedArtist) {
			if (e.key === 'Escape') goBackToList();
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			focusedIndex = focusedIndex < countryArtists.length - 1 ? focusedIndex + 1 : 0;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : countryArtists.length - 1;
		} else if (e.key === 'Enter' && focusedIndex >= 0) {
			handleArtistClick(countryArtists[focusedIndex]);
		} else if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:document
	ontouchstart={handleDocTouchStart}
	ontouchend={handleDocTouchEnd}
/>

{#if selectedCountry}
	<!-- Bottom Panel -->
	<div
		bind:this={panelEl}
		class="fixed bottom-0 left-0 right-0 z-50 max-h-[45vh] overflow-hidden border-t border-pink/10 bg-black font-mono"
		transition:fly={{ y: 300, duration: 200 }}
		onkeydown={handlePanelKeydown}
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
					<h3 class="text-xs font-normal uppercase tracking-[0.15em] text-pink/30">
						{selectedCountry}
					</h3>
					<span class="text-[0.6rem] text-pink/30">{countryArtists.length}</span>
				</div>

				<div class="overflow-y-auto" style="max-height: calc(45vh - 100px);">
					<ul class="space-y-0">
						{#each countryArtists as artist, i (artist.id)}
							<li in:fly={{ y: 8, duration: 120, delay: i * 40 }}>
								<button
									class="w-full cursor-pointer border-b border-pink/5 bg-transparent py-2.5 text-left font-mono transition-all duration-150 hover:opacity-60 {focusedIndex === i ? 'border-l-2 border-l-pink pl-2' : 'px-0'}"
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
