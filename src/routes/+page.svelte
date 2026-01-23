<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import ArtistPopup from '$lib/components/ArtistPopup.svelte';
	import NavMenu from '$lib/components/NavMenu.svelte';
	import type { Artist } from '$lib/data/artists';

	let selectedArtist = $state<Artist | null>(null);

	function selectArtist(artist: Artist) {
		selectedArtist = artist;
	}

	function closePopup() {
		selectedArtist = null;
	}
</script>

<div class="w-screen h-dvh overflow-hidden relative bg-black">
	<div class="w-full h-full">
		<Scene onselect={selectArtist} targetArtist={selectedArtist} />
	</div>

	<NavMenu onselect={selectArtist} />

	{#if selectedArtist}
		<ArtistPopup artist={selectedArtist} onclose={closePopup} />
	{/if}
</div>
