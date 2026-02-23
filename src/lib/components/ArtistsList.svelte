<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onArtistSelect: (artist: Artist) => void;
	}

	let { selectedCountry, onCountrySelect, onArtistSelect }: Props = $props();

	// Track previous country to trigger list animation
	let prevCountry: string | null = null;
	let listKey = $state(0);

	$effect(() => {
		if (selectedCountry !== prevCountry) {
			listKey++;
			prevCountry = selectedCountry;
		}
	});

	// Filter artists based on selected country
	const filteredArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : artists
	);

	// Keyboard navigation
	let focusedIndex = $state(-1);
	let listEl = $state<HTMLUListElement | null>(null);

	// Reset focused index when filtered list changes
	$effect(() => {
		filteredArtists;
		focusedIndex = -1;
	});

	// Scroll focused item into view
	$effect(() => {
		if (focusedIndex >= 0 && listEl) {
			const items = listEl.querySelectorAll('li');
			items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			focusedIndex = focusedIndex < filteredArtists.length - 1 ? focusedIndex + 1 : 0;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredArtists.length - 1;
		} else if (e.key === 'Enter' && focusedIndex >= 0) {
			e.stopPropagation();
			onArtistSelect(filteredArtists[focusedIndex]);
		}
	}
</script>

<!-- Desktop only: Artists list on left side -->
<div
	class="fixed top-6 left-6 z-50 font-mono"
	onclick={(e) => e.stopPropagation()}
	onkeydown={handleKeydown}
	role="menu"
	tabindex="-1"
>
	<ul bind:this={listEl} class="max-h-[50vh] flex-col gap-0 overflow-y-auto">
		{#key listKey}
			{#each filteredArtists as artist, i (artist.id)}
				<li in:fly={{ x: -10, duration: 150, delay: Math.min(i * 25, 250) }}>
					<button
						class="cursor-pointer border-none bg-transparent px-0 py-[0.35rem] text-left font-mono text-[0.8rem] tracking-[0.05em] whitespace-nowrap uppercase transition-all duration-150 hover:text-pink {focusedIndex ===
						i
							? 'border-l-2 border-l-pink pl-2 text-pink'
							: 'text-black/40'}"
						onclick={() => onArtistSelect(artist)}
					>
						{artist.name}
					</button>
				</li>
			{/each}
		{/key}
	</ul>
</div>
