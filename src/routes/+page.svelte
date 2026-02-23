<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';
	import CountryFilter from '$lib/components/CountryFilter.svelte';
	import MobileCountryPanel from '$lib/components/MobileCountryPanel.svelte';
	import ArtistPinsOverlay from '$lib/components/ArtistPinsOverlay.svelte';
	import { type Artist } from '$lib/data/artists';
	import {
		openArtistDrawer,
		closeArtistDrawer,
		getSelectedArtist
	} from '$lib/stores/artist-drawer.svelte';

	let drawerArtist = $derived(getSelectedArtist());

	// Filter state (controls artist list filtering)
	let selectedCountry = $state<string | null>(null);
	// Camera focus state (controls globe camera position)
	let focusCountry = $state<string | null>(null);
	let justSelectedCountry = false;

	// Click on globe country: set both filter and camera
	function selectCountry(name: string) {
		selectedCountry = name;
		focusCountry = name;
		closeArtistDrawer();
		justSelectedCountry = true;
		setTimeout(() => (justSelectedCountry = false), 0);
	}

	// Country tag click: set both filter and camera
	function handleCountrySelect(country: string | null) {
		selectedCountry = country;
		focusCountry = country;
		closeArtistDrawer();
	}

	function handleArtistSelect(artist: Artist | null) {
		if (artist) {
			openArtistDrawer(artist);
		}
	}

	// Artist select: only move camera, don't change filter
	function handleFocusCountry(country: string | null) {
		focusCountry = country;
	}

	function clearCountry() {
		if (justSelectedCountry) return;
		selectedCountry = null;
		focusCountry = null;
		closeArtistDrawer();
	}
</script>

<div class="relative h-dvh w-screen overflow-hidden" style="background:#f0f5fa">

	<!-- Mobile: Hint text (shows when no country selected) -->
	{#if !selectedCountry}
		<div
			class="pointer-events-none absolute right-0 bottom-16 left-0 z-30 flex justify-center sm:hidden"
		>
			<span
				class="px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase" style="background:#f0f5fa"
			>
				Tap a country to explore
			</span>
		</div>
	{/if}

	<!-- Globe scene -->
	<div
		class="absolute inset-0"
		onclick={clearCountry}
		onkeydown={(e) => e.key === 'Escape' && clearCountry()}
		role="button"
		tabindex="-1"
	>
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} {focusCountry} />
		</Scene>
	</div>

	<!-- Desktop: Country Filter - top center -->
	<CountryFilter {selectedCountry} onCountrySelect={handleCountrySelect} />

	<!-- Desktop: Artists Panel (hidden when artist drawer is open) -->
	<div class="hidden {drawerArtist ? '' : 'sm:block'}">
		<ArtistsPanel
			{selectedCountry}
			onCountrySelect={handleCountrySelect}
			onArtistSelect={handleArtistSelect}
			onFocusCountry={handleFocusCountry}
		/>
	</div>

	<!-- Mobile: Country Panel (only when no country selected; pins overlay replaces it) -->
	{#if !selectedCountry}
		<div class="sm:hidden">
			<MobileCountryPanel
				{selectedCountry}
				onClose={clearCountry}
				onArtistSelect={handleArtistSelect}
			/>
		</div>
	{/if}

	<!-- Artist pins overlay (all screen sizes) -->
	<ArtistPinsOverlay {selectedCountry} />

</div>
