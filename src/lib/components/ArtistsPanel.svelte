<script lang="ts">
	import { untrack } from 'svelte';
	import { fly, fade } from 'svelte/transition';
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

	// Reset to list view when country changes (unless selecting artist)
	$effect(() => {
		selectedCountry;
		untrack(() => {
			if (!isSelectingArtist) {
				selectedArtist = null;
			}
			isSelectingArtist = false;
		});
	});

	function selectArtist(artist: Artist) {
		isSelectingArtist = true;
		selectedArtist = artist;
		onFocusCountry(artist.country);
	}

	function goBackToList() {
		selectedArtist = null;
	}
</script>

{#if selectedArtist}
	<div
		in:fly={{ x: 20, duration: 250 }}
		out:fade={{ duration: 150 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="presentation"
	>
		<ArtistDetail artist={selectedArtist} onBack={goBackToList} />
	</div>
{:else}
	<div
		in:fade={{ duration: 200, delay: 50 }}
		out:fade={{ duration: 100 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="presentation"
	>
		<ArtistsList
			{selectedCountry}
			{onCountrySelect}
			onArtistSelect={selectArtist}
		/>
	</div>
{/if}
