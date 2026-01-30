<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';

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
	<div class="absolute inset-0" onclick={clearCountry} onkeydown={(e) => e.key === 'Escape' && clearCountry()} role="button" tabindex="-1">
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} {focusCountry} />
		</Scene>
	</div>

	<!-- Artists Panel / Nav Menu -->
	<ArtistsPanel {selectedCountry} onCountrySelect={handleCountrySelect} onFocusCountry={handleFocusCountry} />

	<!-- Footer -->
	<footer
		class="pointer-events-none absolute bottom-0 right-0 z-40 p-4 font-mono text-pink sm:bottom-0 sm:left-0 sm:right-auto sm:p-6"
	>
		<p class="text-[0.5rem] uppercase tracking-[0.2em] opacity-40">UNDERGROUND MUSIC · WORLDWIDE</p>
	</footer>
</div>
