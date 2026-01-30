<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onArtistSelect: (artist: Artist) => void;
		countryTagRefs: Record<string, HTMLButtonElement>;
	}

	let { selectedCountry, onCountrySelect, onArtistSelect, countryTagRefs = $bindable({}) }: Props =
		$props();

	// Track previous country to trigger list animation
	let prevCountry: string | null = null;
	let listKey = $state(0);

	$effect(() => {
		if (selectedCountry !== prevCountry) {
			listKey++;
			prevCountry = selectedCountry;
		}
	});

	// Toggle for country filter on desktop
	let showCountryFilter = $state(false);

	// Get unique countries from artists
	const countries = [...new Set(artists.map((a) => a.country))].sort();

	// Filter artists based on selected country
	const filteredArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : artists
	);

	function handleTagClick(country: string) {
		if (selectedCountry === country) {
			onCountrySelect(null);
		} else {
			onCountrySelect(country);
		}
		showCountryFilter = false;
	}

	function clearFilter() {
		onCountrySelect(null);
		showCountryFilter = false;
	}
</script>

<div
	class="fixed bottom-0 left-0 right-0 z-50 border-t border-pink/20 bg-black/85 px-4 py-3 font-mono backdrop-blur-sm
		sm:bottom-auto sm:right-auto sm:top-6 sm:left-6 sm:border-t-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.stopPropagation()}
	role="menu"
	tabindex="-1"
>
	<!-- Header with title and filter toggle - desktop -->
	<div class="mb-3 hidden items-center gap-3 sm:flex">
		<h2 class="text-[0.65rem] uppercase tracking-[0.2em] text-pink opacity-70">
			WHERE THE FUCK IS :
		</h2>
		<button
			class="cursor-pointer border-none bg-transparent font-mono text-[0.55rem] uppercase text-pink transition-all duration-150
				{showCountryFilter || selectedCountry ? 'opacity-100' : 'opacity-50 hover:opacity-80'}"
			onclick={() => (showCountryFilter = !showCountryFilter)}
		>
			[{showCountryFilter ? '−' : '+'}]
		</button>
	</div>

	<!-- Selected country indicator - desktop -->
	{#if selectedCountry && !showCountryFilter}
		<div
			class="mb-2 hidden items-center gap-2 sm:flex"
			in:fly={{ y: -10, duration: 200 }}
			out:scale={{ duration: 150 }}
		>
			<span class="text-[0.6rem] uppercase text-pink opacity-50">FILTER:</span>
			<button
				class="cursor-pointer border-none bg-transparent font-mono text-[0.65rem] uppercase text-pink opacity-100 transition-all [text-shadow:0_0_8px_#ffaef6] hover:opacity-80"
				onclick={clearFilter}
			>
				{selectedCountry} [×]
			</button>
		</div>
	{/if}

	<!-- Country Tags - mobile: always visible, desktop: collapsible -->
	<div
		class="mb-2 flex flex-row gap-1 overflow-x-auto [scrollbar-width:none] sm:mb-3 sm:max-h-32 sm:flex-wrap sm:gap-1.5 sm:overflow-y-auto
			{showCountryFilter ? 'sm:flex' : 'sm:hidden'}"
	>
		<button
			class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-200
				{!selectedCountry ? 'scale-110 opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'scale-100 opacity-50 hover:scale-105 hover:opacity-80'}"
			onclick={clearFilter}
		>
			[ALL]
		</button>
		{#each countries as country (country)}
			{@const isActive = selectedCountry === country}
			<button
				bind:this={countryTagRefs[country]}
				class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-200
					{isActive ? 'scale-110 opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'scale-100 opacity-50 hover:scale-105 hover:opacity-80'}"
				onclick={() => handleTagClick(country)}
			>
				[{country.length > 8 ? country.slice(0, 6) + '..' : country}]
			</button>
		{/each}
	</div>

	<!-- Artists List - desktop: limited height with scroll -->
	<ul
		class="flex flex-row gap-0 overflow-x-auto [scrollbar-width:none]
			sm:max-h-[50vh] sm:flex-col sm:gap-[0.2rem] sm:overflow-x-visible sm:overflow-y-auto"
	>
		{#key listKey}
			{#each filteredArtists as artist, i (artist.id)}
				<li
					in:fly={{ x: -15, duration: 200, delay: Math.min(i * 30, 300) }}
				>
					<button
						class="cursor-pointer whitespace-nowrap border-b-2 border-b-transparent border-none bg-transparent px-3 py-[0.4rem] text-left font-mono text-[0.75rem] uppercase text-pink transition-all duration-150 hover:border-b-pink
							sm:border-b-0 sm:border-l-2 sm:border-l-transparent sm:px-2 sm:py-[0.3rem] sm:text-[0.85rem] sm:hover:border-b-0 sm:hover:border-l-pink sm:hover:pl-4 sm:hover:[text-shadow:0_0_8px_#ffaef6]"
						onclick={() => onArtistSelect(artist)}
					>
						{artist.name}
					</button>
				</li>
			{/each}
		{/key}
	</ul>
</div>
