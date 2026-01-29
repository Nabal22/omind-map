<script lang="ts">
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onArtistSelect: (artist: Artist) => void;
		countryTagRefs: Record<string, HTMLButtonElement>;
	}

	let { selectedCountry, onCountrySelect, onArtistSelect, countryTagRefs = $bindable({}) }: Props =
		$props();

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
	<!-- Title - desktop only -->
	<h2 class="mb-3 hidden text-[0.65rem] uppercase tracking-[0.2em] text-pink opacity-70 sm:block">
		WHERE THE FUCK IS :
	</h2>

	<!-- Country Tags -->
	<div
		class="mb-2 flex flex-row gap-1 overflow-x-auto [scrollbar-width:none] sm:mb-3 sm:flex-wrap sm:gap-1.5 sm:overflow-x-visible"
	>
		<button
			class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-150
				{!selectedCountry ? 'opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'opacity-50 hover:opacity-80'}"
			onclick={() => onCountrySelect(null)}
		>
			[ALL]
		</button>
		{#each countries as country (country)}
			{@const isActive = selectedCountry === country}
			<button
				bind:this={countryTagRefs[country]}
				class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-150
					{isActive ? 'opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'opacity-50 hover:opacity-80'}"
				onclick={() => handleTagClick(country)}
			>
				[{country.length > 8 ? country.slice(0, 6) + '..' : country}]
			</button>
		{/each}
	</div>

	<!-- Artists List -->
	<ul
		class="flex flex-row gap-0 overflow-x-auto [scrollbar-width:none]
			sm:flex-col sm:gap-[0.2rem] sm:overflow-x-visible"
	>
		{#each filteredArtists as artist (artist.id)}
			<li>
				<button
					class="cursor-pointer whitespace-nowrap border-b-2 border-b-transparent border-none bg-transparent px-3 py-[0.4rem] text-left font-mono text-[0.75rem] uppercase text-pink transition-all duration-150 hover:border-b-pink
						sm:border-b-0 sm:border-l-2 sm:border-l-transparent sm:px-2 sm:py-[0.3rem] sm:text-[0.85rem] sm:hover:border-b-0 sm:hover:border-l-pink sm:hover:pl-4 sm:hover:[text-shadow:0_0_8px_#ffaef6]"
					onclick={() => onArtistSelect(artist)}
				>
					{artist.name}
				</button>
			</li>
		{/each}
	</ul>
</div>
