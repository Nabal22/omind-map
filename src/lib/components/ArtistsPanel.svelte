<script lang="ts">
	import { untrack } from 'svelte';
	import type { Artist } from '$lib/data/artists';
	import ArtistDetail from './ArtistDetail.svelte';
	import ArtistsList from './ArtistsList.svelte';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onFocusCountry: (country: string | null) => void;
	}

	let { selectedCountry, onCountrySelect, onFocusCountry }: Props = $props();

	// Selected artist for detail view
	let selectedArtist = $state<Artist | null>(null);

	// Flag to prevent resetting artist when we're selecting one
	let isSelectingArtist = false;

	// Country tag button refs for scrolling into view
	let countryTagRefs: Record<string, HTMLButtonElement> = $state({});

	// Reset to list view and scroll tag into view when country changes (unless selecting artist)
	$effect(() => {
		const country = selectedCountry;
		untrack(() => {
			if (!isSelectingArtist) {
				selectedArtist = null;
			}
			isSelectingArtist = false;
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
		isSelectingArtist = true;
		selectedArtist = artist;
		// Focus on the artist's country
		onCountrySelect(artist.country);
	}

	function goBackToList() {
		selectedArtist = null;
		onCountrySelect(null);
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
