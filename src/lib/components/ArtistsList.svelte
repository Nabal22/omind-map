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
	<ul class="max-h-[50vh] flex-col gap-0 overflow-y-auto">
		{#key listKey}
			{#each filteredArtists as artist, i (artist.id)}
				<li in:fly={{ x: -10, duration: 150, delay: Math.min(i * 25, 250) }}>
					<button
						class="cursor-pointer whitespace-nowrap border-none bg-transparent px-0 py-[0.35rem] text-left font-mono text-[0.8rem] uppercase tracking-[0.05em] text-pink/40 transition-all duration-150 hover:text-pink"
						onclick={() => onArtistSelect(artist)}
					>
						{artist.name}
					</button>
				</li>
			{/each}
		{/key}
	</ul>
</div>
