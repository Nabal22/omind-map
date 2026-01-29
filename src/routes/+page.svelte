<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import CountryPanel from '$lib/components/CountryPanel.svelte';
	import ArtistPopup from '$lib/components/ArtistPopup.svelte';
	import { artists, type Artist } from '$lib/data/artists';

	let selectedCountry = $state<string | null>(null);
	let selectedArtist = $state<Artist | null>(null);

	const artistsByCountry = $derived.by(() => {
		if (!selectedCountry) return [];
		return artists.filter((a) => a.country === selectedCountry);
	});

	function selectCountry(name: string) {
		selectedCountry = name;
		selectedArtist = null;
	}

	function selectArtist(artist: Artist) {
		selectedArtist = artist;
	}

	function closeCountryPanel() {
		selectedCountry = null;
		selectedArtist = null;
	}

	function closeArtistPopup() {
		selectedArtist = null;
	}
</script>

<div class="relative h-dvh w-screen overflow-hidden bg-black">
	<!-- Header -->
	<header class="pointer-events-none absolute top-0 left-0 z-40 p-4 font-mono text-pink sm:p-6">
		<p class="mb-1 text-[0.5rem] tracking-[0.3em] uppercase opacity-50 sm:text-[0.6rem]">
			0MIND PRESENTS
		</p>
		<h1
			class="text-lg font-bold tracking-tight uppercase [text-shadow:0_0_20px_#ffaef6] sm:text-2xl"
		>
			WHERE THE FUCK IS
		</h1>
		<p class="mt-1 text-[0.55rem] tracking-[0.2em] uppercase opacity-40 sm:text-[0.65rem]">
			CLICK A COUNTRY TO EXPLORE
		</p>
	</header>

	<!-- 3D Scene -->
	<div class="absolute inset-0">
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} />
		</Scene>
	</div>

	<!-- Footer -->
	<footer class="pointer-events-none absolute bottom-0 left-0 z-40 p-4 font-mono text-pink sm:p-6">
		<p class="text-[0.5rem] tracking-[0.2em] uppercase opacity-40">UNDERGROUND MUSIC · WORLDWIDE</p>
	</footer>

	<!-- Panels -->
	{#if selectedCountry}
		<CountryPanel
			countryName={selectedCountry}
			artists={artistsByCountry}
			onArtistClick={selectArtist}
			onClose={closeCountryPanel}
		/>
	{/if}

	{#if selectedArtist}
		<ArtistPopup artist={selectedArtist} onclose={closeArtistPopup} />
	{/if}
</div>
