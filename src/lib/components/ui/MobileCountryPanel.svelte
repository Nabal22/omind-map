<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists, type Artist } from '$lib/data/artists';
	import { createOutsideTapDetector, createSwipeToDismiss } from '$lib/utils/touch.svelte';

	interface Props {
		selectedCountry: string | null;
		onClose: () => void;
		onArtistSelect: (artist: Artist | null) => void;
	}

	let { selectedCountry, onClose, onArtistSelect }: Props = $props();

	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);

	let panelEl = $state<HTMLElement | null>(null);

	const outsideTap = createOutsideTapDetector(
		() => panelEl,
		() => {
			if (selectedCountry) onClose();
		}
	);

	// Keyboard navigation
	let focusedIndex = $state(-1);

	$effect(() => {
		void countryArtists;
		focusedIndex = -1;
	});

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
			onArtistSelect(countryArtists[focusedIndex]);
		} else if (e.key === 'Escape') {
			onClose();
		}
	}

	// Swipe-to-dismiss
	const swipe = createSwipeToDismiss(
		() => panelEl,
		() => onClose()
	);
</script>

<svelte:document ontouchstart={outsideTap.onTouchStart} ontouchend={outsideTap.onTouchEnd} />

{#if selectedCountry}
	<div
		bind:this={panelEl}
		class="fixed right-0 left-0 z-[55] max-h-[45vh] overflow-hidden border-t border-black/10 bg-white font-mono"
		style="bottom: calc(44px + env(safe-area-inset-bottom, 0px)); transform: translateY({swipe.dragY}px); transition: {swipe.dragging
			? 'none'
			: 'transform 200ms ease'};"
		transition:fly={{ y: 300, duration: 200 }}
		onkeydown={handlePanelKeydown}
		ontouchstart={swipe.onTouchStart}
		ontouchend={swipe.onTouchEnd}
		role="dialog"
		tabindex="-1"
	>
		<div class="flex justify-center py-2">
			<div class="h-px w-10 bg-black/10"></div>
		</div>

		<div class="px-4 pb-4">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-xs font-bold tracking-[0.15em] text-black/50 uppercase">
					{selectedCountry}
				</h3>
				<button
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent text-black/30 transition-colors duration-150 hover:text-black/60"
					onclick={onClose}
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
					>
				</button>
			</div>

			<div class="overflow-y-auto" style="max-height: calc(40vh - 100px);">
				<ul class="space-y-0">
					{#each countryArtists as artist, i (artist.id)}
						<li in:fly={{ y: 8, duration: 120, delay: i * 40 }}>
							<button
								class="min-h-[44px] w-full cursor-pointer border-b border-black/5 bg-transparent py-3 text-left font-mono transition-all duration-150 hover:opacity-60 {focusedIndex ===
								i
									? 'border-l-2 border-l-pink pl-2'
									: 'px-0'}"
								onclick={() => onArtistSelect(artist)}
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
