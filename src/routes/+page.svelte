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

<div class="app">
	<div class="scene-container">
		<Scene onselect={selectArtist} targetArtist={selectedArtist} />
	</div>

	<NavMenu onselect={selectArtist} />

	{#if selectedArtist}
		<ArtistPopup artist={selectedArtist} onclose={closePopup} />
	{/if}
</div>

<style>
	.app {
		width: 100vw;
		height: 100dvh;
		overflow: hidden;
		position: relative;
		background: #000;
	}

	.scene-container {
		width: 100%;
		height: 100%;
	}
</style>
