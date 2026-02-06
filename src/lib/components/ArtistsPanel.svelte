<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Artist } from '$lib/data/artists';
	import ArtistsList from './ArtistsList.svelte';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onArtistSelect: (artist: Artist | null) => void;
		onFocusCountry: (country: string | null) => void;
	}

	let { selectedCountry, onCountrySelect, onArtistSelect, onFocusCountry }: Props = $props();

	function selectArtist(artist: Artist) {
		onArtistSelect(artist);
		onFocusCountry(artist.country);
	}
</script>

<div
	in:fade={{ duration: 200, delay: 50 }}
	out:fade={{ duration: 100 }}
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => {
		if (e.key === 'Escape') onCountrySelect(null);
	}}
	role="presentation"
>
	<ArtistsList {selectedCountry} {onCountrySelect} onArtistSelect={selectArtist} />
</div>
