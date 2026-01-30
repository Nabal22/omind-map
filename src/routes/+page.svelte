<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';
	import CountryFilter from '$lib/components/CountryFilter.svelte';
	import MobileDrawer from '$lib/components/MobileDrawer.svelte';

	// Filter state (controls artist list filtering)
	let selectedCountry = $state<string | null>(null);
	// Camera focus state (controls globe camera position)
	let focusCountry = $state<string | null>(null);
	let justSelectedCountry = false;

	// Mobile drawer state
	let drawerOpen = $state(false);

	// Click on globe country: set both filter and camera
	function selectCountry(name: string) {
		selectedCountry = name;
		focusCountry = name;
		justSelectedCountry = true;
		// On mobile, open drawer when clicking a country
		if (typeof window !== 'undefined' && window.innerWidth <= 640) {
			drawerOpen = true;
		}
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
	<!-- Mobile: Logo centré en haut -->
	<div class="absolute left-0 right-0 top-4 z-50 flex w-full justify-center pointer-events-none sm:hidden">
		<img src="/assets/icon-512.png" alt="0mind logo" class="h-20 w-20" />
	</div>

	<!-- Mobile: Hamburger button -->
	<button
		class="fixed left-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-pink/30 bg-black/70 text-pink backdrop-blur-sm transition-all hover:border-pink/50 hover:bg-black/90 sm:hidden"
		onclick={() => (drawerOpen = true)}
		aria-label="Open menu"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>

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

	<!-- Mobile: Drawer -->
	<MobileDrawer
		isOpen={drawerOpen}
		{selectedCountry}
		onClose={() => (drawerOpen = false)}
		onCountrySelect={handleCountrySelect}
		onFocusCountry={handleFocusCountry}
	/>

	<!-- Footer: Logo desktop -->
	<footer class="absolute bottom-5 left-5 z-50 opacity-70">
		<img src="/assets/icon-512.png" alt="0mind logo" class="hidden h-12 w-12 sm:block" />
	</footer>
</div>
