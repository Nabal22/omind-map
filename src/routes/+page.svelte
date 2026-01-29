<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Globe from '$lib/components/Globe.svelte';
	import CountryPanel from '$lib/components/CountryPanel.svelte';
	import ArtistPopup from '$lib/components/ArtistPopup.svelte';
	import { artists, type Artist } from '$lib/data/artists';

	let selectedCountry = $state<string | null>(null);
	let selectedArtist = $state<Artist | null>(null);

	const artistsByCountry = $derived.by(() => {
		if (!selectedCountry) return [];
		return artists.filter((a) => a.country === selectedCountry);
	});

	function handleCountryClick(countryName: string) {
		selectedCountry = countryName;
		selectedArtist = null;
	}

	function handleArtistClick(artist: Artist) {
		selectedArtist = artist;
	}

	function handleCloseCountryPanel() {
		selectedCountry = null;
		selectedArtist = null;
	}

	function handleCloseArtistPopup() {
		selectedArtist = null;
	}
</script>

<div class="relative h-dvh w-screen overflow-hidden bg-black">
	<header
		class="pointer-events-none absolute top-0 left-0 z-40 p-4 font-mono text-pink
			sm:p-6"
	>
		<p class="mb-1 text-[0.5rem] uppercase tracking-[0.3em] opacity-50 sm:text-[0.6rem]">
			0MIND PRESENTS
		</p>
		<h1
			class="text-lg font-bold uppercase tracking-tight [text-shadow:0_0_20px_#ffaef6,0_0_40px_#ffaef640]
				sm:text-2xl"
		>
			WHERE THE FUCK IS
		</h1>
		<p class="mt-1 text-[0.55rem] uppercase tracking-[0.2em] opacity-40 sm:text-[0.65rem]">
			CLICK A COUNTRY TO EXPLORE
		</p>
	</header>

	<div class="absolute inset-0">
		<Canvas>
			<Globe onCountryClick={handleCountryClick} {selectedCountry} />
		</Canvas>
	</div>

	<footer
		class="pointer-events-none absolute bottom-0 left-0 z-40 p-4 font-mono text-pink
			sm:p-6"
	>
		<p class="text-[0.5rem] uppercase tracking-[0.2em] opacity-40">
			UNDERGROUND MUSIC · WORLDWIDE
		</p>
	</footer>

	{#if selectedCountry}
		<CountryPanel
			countryName={selectedCountry}
			artists={artistsByCountry}
			onArtistClick={handleArtistClick}
			onClose={handleCloseCountryPanel}
		/>
	{/if}

	{#if selectedArtist}
		<ArtistPopup artist={selectedArtist} onclose={handleCloseArtistPopup} />
	{/if}
</div>
