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
</script>

<!-- Desktop only: Artists list on left side -->
<div
	class="fixed left-6 top-6 z-50 font-mono"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.stopPropagation()}
	role="menu"
	tabindex="-1"
>
	<ul class="max-h-[50vh] flex-col gap-[0.2rem] overflow-y-auto">
		{#key listKey}
			{#each filteredArtists as artist, i (artist.id)}
				<li in:fly={{ x: -15, duration: 200, delay: Math.min(i * 30, 300) }}>
					<button
						class="cursor-pointer whitespace-nowrap border-l-2 border-l-transparent border-none bg-transparent px-2 py-[0.3rem] text-left font-mono text-[0.85rem] uppercase text-pink transition-all duration-150 hover:border-l-pink hover:pl-4 hover:[text-shadow:0_0_8px_#ffaef6]"
						onclick={() => onArtistSelect(artist)}
					>
						{artist.name}
					</button>
				</li>
			{/each}
		{/key}
	</ul>
</div>
