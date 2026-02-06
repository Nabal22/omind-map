<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';
	import CountryFilter from '$lib/components/CountryFilter.svelte';
	import MobileCountryPanel from '$lib/components/MobileCountryPanel.svelte';

	// Filter state (controls artist list filtering)
	let selectedCountry = $state<string | null>(null);
	// Camera focus state (controls globe camera position)
	let focusCountry = $state<string | null>(null);
	let justSelectedCountry = false;

	// Click on globe country: set both filter and camera
	function selectCountry(name: string) {
		selectedCountry = name;
		focusCountry = name;
		justSelectedCountry = true;
		setTimeout(() => (justSelectedCountry = false), 0);
	}

	// Country tag click: set both filter and camera
	function handleCountrySelect(country: string | null) {
		selectedCountry = country;
		focusCountry = country;
	}

	// Artist select: only move camera, don't change filter
	function handleFocusCountry(country: string | null) {
		focusCountry = country;
	}

	function clearCountry() {
		if (justSelectedCountry) return;
		selectedCountry = null;
		focusCountry = null;
	}
</script>

<div class="relative h-dvh w-screen overflow-hidden bg-black">
	<!-- Mobile: Logo centred en haut -->
	<div class="pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center sm:hidden">
		<img src="/assets/icon-512.png" alt="0mind logo" class="h-14 w-14 opacity-60" />
	</div>

	<!-- Mobile: Hint text (shows when no country selected) -->
	{#if !selectedCountry}
		<div class="pointer-events-none absolute bottom-8 left-0 right-0 z-30 flex justify-center sm:hidden">
			<span class="bg-black px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-pink/30">
				Tap a country to explore
			</span>
		</div>
	{/if}

	<!-- Globe scene -->
	<div class="absolute inset-0" onclick={clearCountry} onkeydown={(e) => e.key === 'Escape' && clearCountry()} role="button" tabindex="-1">
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} {focusCountry} />
		</Scene>
	</div>

	<!-- Desktop: Country Filter - top center -->
	<CountryFilter {selectedCountry} onCountrySelect={handleCountrySelect} />

	<!-- Desktop: Artists Panel / Nav Menu -->
	<div class="hidden sm:block">
		<ArtistsPanel {selectedCountry} onCountrySelect={handleCountrySelect} onFocusCountry={handleFocusCountry} />
	</div>

	<!-- Mobile: Country Panel (appears when country is selected) -->
	<div class="sm:hidden">
		<MobileCountryPanel {selectedCountry} onClose={clearCountry} />
	</div>

	<!-- Footer: Logo desktop -->
	<footer class="absolute bottom-5 left-5 z-50 opacity-50">
		<img src="/assets/icon-512.png" alt="0mind logo" class="hidden h-10 w-10 sm:block" />
	</footer>
</div>
