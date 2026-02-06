<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
	}

	let { selectedCountry, onCountrySelect }: Props = $props();

	// Get unique countries from artists
	const countries = [...new Set(artists.map((a) => a.country))].sort();

	function handleTagClick(country: string) {
		if (selectedCountry === country) {
			onCountrySelect(null);
		} else {
			onCountrySelect(country);
		}
	}

	function clearFilter() {
		onCountrySelect(null);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- Desktop only: top center filter bar -->
<nav
	class="pointer-events-auto fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 sm:block"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.stopPropagation()}
>
	<div
		class="flex items-center gap-1 rounded-full border border-pink/20 bg-black/60 px-3 py-2 font-mono backdrop-blur-md"
	>
		<button
			class="cursor-pointer border-none bg-transparent px-2 py-0.5 font-mono text-[0.6rem] uppercase text-pink transition-all duration-200
				{!selectedCountry ? 'scale-110 opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'scale-100 opacity-50 hover:scale-105 hover:opacity-80'}"
			onclick={clearFilter}
		>
			[ALL]
		</button>

		<span class="mx-1 text-pink/30">|</span>

		<div class="flex max-w-[60vw] gap-1 overflow-x-auto [scrollbar-width:none]">
			{#each countries as country (country)}
				{@const isActive = selectedCountry === country}
				<button
					class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-0.5 font-mono text-[0.6rem] uppercase text-pink transition-all duration-200
						{isActive ? 'scale-110 opacity-100 [text-shadow:0_0_8px_#ffaef6]' : 'scale-100 opacity-50 hover:scale-105 hover:opacity-80'}"
					onclick={() => handleTagClick(country)}
				>
					[{country.length > 10 ? country.slice(0, 8) + '..' : country}]
				</button>
			{/each}
		</div>
	</div>
</nav>
