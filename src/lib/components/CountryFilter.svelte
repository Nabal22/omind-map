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
	class="pointer-events-auto fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 sm:block"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.stopPropagation()}
>
	<div class="flex items-center gap-0 border border-black/10 bg-white font-mono">
		<button
			class="cursor-pointer border-r border-none border-r-black/10 bg-transparent px-3 py-2 font-mono text-[0.6rem] tracking-[0.15em] uppercase transition-opacity duration-150
				{!selectedCountry ? 'text-pink' : 'text-black/30 hover:text-pink'}"
			onclick={clearFilter}
		>
			ALL
		</button>

		<span class="text-black/10">|</span>

		<div class="flex max-w-[60vw] gap-0 overflow-x-auto [scrollbar-width:none]">
			{#each countries as country (country)}
				{@const isActive = selectedCountry === country}
				<button
					class="shrink-0 cursor-pointer border-none bg-transparent px-3 py-2 font-mono text-[0.6rem] tracking-[0.15em] uppercase transition-opacity duration-150
						{isActive ? 'text-pink' : 'text-black/30 hover:text-pink'}"
					onclick={() => handleTagClick(country)}
				>
					{country}
				</button>
			{/each}
		</div>
	</div>
</nav>
