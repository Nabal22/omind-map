<script lang="ts">
	import { untrack } from 'svelte';
	import type { Artist } from '$lib/data/artists';
	import ArtistDetail from './ArtistDetail.svelte';
	import ArtistsList from './ArtistsList.svelte';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
	}

	let { selectedCountry, onCountrySelect }: Props = $props();

	// Selected artist for detail view
	let selectedArtist = $state<Artist | null>(null);

	// Country tag button refs for scrolling into view
	let countryTagRefs: Record<string, HTMLButtonElement> = $state({});

	// Reset to list view and scroll tag into view when country changes
	$effect(() => {
		const country = selectedCountry;
		untrack(() => {
			selectedArtist = null;
			if (country && countryTagRefs[country]) {
				countryTagRefs[country].scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center'
				});
			}
		});
	});

	function selectArtist(artist: Artist) {
		selectedArtist = artist;
	}

	function goBackToList() {
		selectedArtist = null;
	}
</script>

{#if selectedArtist}
	<ArtistDetail artist={selectedArtist} onBack={goBackToList} />
{:else}
	<ArtistsList
		{selectedCountry}
		{onCountrySelect}
		onArtistSelect={selectArtist}
		bind:countryTagRefs
	/>
{/if}
