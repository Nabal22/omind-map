<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';
	import ArtistPopup from '$lib/components/ArtistPopup.svelte';
	import type { Artist } from '$lib/data/artists';

	let selectedCountry = $state<string | null>(null);
	let selectedArtist = $state<Artist | null>(null);
	let isPanelOpen = $state(false);

	function selectCountry(name: string) {
		selectedCountry = name;
		isPanelOpen = true;
	}

	function handleCountrySelect(country: string | null) {
		selectedCountry = country;
	}

	function selectArtist(artist: Artist) {
		selectedArtist = artist;
	}

	function closePanel() {
		isPanelOpen = false;
		selectedCountry = null;
	}

	function closeArtistPopup() {
		selectedArtist = null;
	}

	function openPanel() {
		isPanelOpen = true;
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

	<!-- Open Panel Button -->
	{#if !isPanelOpen}
		<button
			class="absolute right-4 top-4 z-40 cursor-pointer border-2 border-pink bg-black/80 px-4 py-2 font-mono text-xs uppercase tracking-wider text-pink transition-all hover:bg-pink hover:text-black sm:right-6 sm:top-6"
			onclick={openPanel}
		>
			Explore Artists
		</button>
	{/if}

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

	<!-- Artists Panel -->
	{#if isPanelOpen}
		<ArtistsPanel
			{selectedCountry}
			onCountrySelect={handleCountrySelect}
			onArtistClick={selectArtist}
			onClose={closePanel}
		/>
	{/if}

	<!-- Artist Popup -->
	{#if selectedArtist}
		<ArtistPopup artist={selectedArtist} onclose={closeArtistPopup} />
	{/if}
</div>
