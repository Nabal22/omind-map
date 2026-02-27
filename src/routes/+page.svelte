<script lang="ts">
	import Scene from '$lib/components/globe/Scene.svelte';
	import SceneContent from '$lib/components/globe/SceneContent.svelte';
	import ArtistsList from '$lib/components/ui/ArtistsList.svelte';
	import CountryFilter from '$lib/components/ui/CountryFilter.svelte';
	import MobileCountryPanel from '$lib/components/ui/MobileCountryPanel.svelte';

	import { getSelectedArtist } from '$lib/stores/artist-drawer.svelte';
	import { fade } from 'svelte/transition';
	import { isGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import {
		getSelectedCountry,
		getFocusCountry,
		selectCountry,
		setCountryFilter,
		selectArtist,
		setFocusCountry,
		clearSelection
	} from '$lib/stores/explore.svelte';

	const globeLoaded = $derived(isGlobeLoaded());
	const drawerArtist = $derived(getSelectedArtist());
	const selectedCountry = $derived(getSelectedCountry());
	const focusCountry = $derived(getFocusCountry());
</script>

<div class="relative h-dvh w-screen overflow-hidden" style="background:#f0f5fa">
	{#if !globeLoaded}
		<div
			class="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
			out:fade={{ duration: 600 }}
		>
			<span class="animate-pulse font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
				Loading
			</span>
		</div>
	{/if}

	{#if globeLoaded && !selectedCountry}
		<div
			class="pointer-events-none absolute right-0 bottom-16 left-0 z-30 flex justify-center sm:hidden"
			in:fade={{ duration: 300 }}
		>
			<span
				class="px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase"
				style="background:#f0f5fa"
			>
				Tap a country to explore
			</span>
		</div>
	{/if}

	<!-- Globe scene -->
	<div
		class="absolute inset-0"
		onclick={clearSelection}
		onkeydown={(e) => e.key === 'Escape' && clearSelection()}
		role="button"
		tabindex="-1"
	>
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} {focusCountry} />
		</Scene>
	</div>

	<!-- Desktop: Country Filter -->
	<CountryFilter {selectedCountry} onCountrySelect={setCountryFilter} />

	<!-- Desktop: Artists list (hidden when artist drawer is open) -->
	<div class="hidden {drawerArtist ? '' : 'sm:block'}">
		<div
			in:fade={{ duration: 200, delay: 50 }}
			out:fade={{ duration: 100 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => { if (e.key === 'Escape') setCountryFilter(null); }}
			role="presentation"
		>
			<ArtistsList
				{selectedCountry}
				onArtistSelect={(artist) => {
					selectArtist(artist);
					setFocusCountry(artist.country);
				}}
			/>
		</div>
	</div>

	<!-- Mobile: Country Panel -->
	<div class="sm:hidden">
		<MobileCountryPanel
			{selectedCountry}
			onClose={clearSelection}
			onArtistSelect={(artist) => { if (artist) selectArtist(artist); }}
		/>
	</div>

</div>
