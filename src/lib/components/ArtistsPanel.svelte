<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { Artist } from '$lib/data/artists';
	import ArtistDetail from './ArtistDetail.svelte';
	import ArtistsList from './ArtistsList.svelte';

	interface Props {
		selectedCountry: string | null;
		selectedArtist: Artist | null;
		onCountrySelect: (country: string | null) => void;
		onArtistSelect: (artist: Artist | null) => void;
		onFocusCountry: (country: string | null) => void;
	}

	let { selectedCountry, selectedArtist, onCountrySelect, onArtistSelect, onFocusCountry }: Props = $props();

	function selectArtist(artist: Artist) {
		onArtistSelect(artist);
		onFocusCountry(artist.country);
	}

	function goBackToList() {
		onArtistSelect(null);
	}
</script>

{#if selectedArtist}
	<div
		in:fly={{ x: 20, duration: 250 }}
		out:fade={{ duration: 150 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') goBackToList();
			else e.stopPropagation();
		}}
		role="presentation"
	>
		<ArtistDetail artist={selectedArtist} onBack={goBackToList} />
	</div>
{:else}
	<div
		in:fade={{ duration: 200, delay: 50 }}
		out:fade={{ duration: 100 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') onCountrySelect(null);
		}}
		role="presentation"
	>
		<ArtistsList
			{selectedCountry}
			{onCountrySelect}
			onArtistSelect={selectArtist}
		/>
	</div>
{/if}
