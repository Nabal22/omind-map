<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onClose: () => void;
		onArtistSelect: (artist: Artist | null) => void;
	}

	let { selectedCountry, onClose, onArtistSelect }: Props = $props();

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

	// Keyboard navigation
	let focusedIndex = $state(-1);

	// Reset focused index when artist list changes
	$effect(() => {
		void countryArtists;
		focusedIndex = -1;
	});

	// Auto-focus panel on mount
	$effect(() => {
		if (selectedCountry && panelEl) {
			requestAnimationFrame(() => panelEl?.focus());
		}
	});

	function handlePanelKeydown(e: KeyboardEvent) {
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

<svelte:document ontouchstart={handleDocTouchStart} ontouchend={handleDocTouchEnd} />

{#if selectedCountry}
	<!-- Bottom Panel -->
	<div
		bind:this={panelEl}
		class="hidden fixed right-0 bottom-12 left-0 z-50 max-h-[40vh] overflow-hidden border-t border-black/10 bg-white font-mono"
		transition:fly={{ y: 300, duration: 200 }}
		onkeydown={handlePanelKeydown}
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar -->
		<div class="flex justify-center py-2">
			<div class="h-px w-10 bg-black/10"></div>
		</div>

		<!-- Country Header + Artist List -->
		<div class="px-4 pb-4">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-xs font-bold tracking-[0.15em] text-black/30 uppercase">
					{selectedCountry}
				</h3>
				<span class="text-[0.6rem] text-black/30">{countryArtists.length}</span>
			</div>

			<div class="overflow-y-auto" style="max-height: calc(40vh - 100px);">
				<ul class="space-y-0">
					{#each countryArtists as artist, i (artist.id)}
						<li in:fly={{ y: 8, duration: 120, delay: i * 40 }}>
							<button
								class="w-full cursor-pointer border-b border-black/5 bg-transparent py-2.5 text-left font-mono transition-all duration-150 hover:opacity-60 {focusedIndex ===
								i
									? 'border-l-2 border-l-pink pl-2'
									: 'px-0'}"
								onclick={() => handleArtistClick(artist)}
							>
								<span class="block text-xs tracking-[0.05em] text-pink uppercase"
									>{artist.name}</span
								>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}
