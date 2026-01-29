<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import SceneContent from '$lib/components/SceneContent.svelte';
	import ArtistsPanel from '$lib/components/ArtistsPanel.svelte';

	let selectedCountry = $state<string | null>(null);
	let justSelectedCountry = false;

	function selectCountry(name: string) {
		selectedCountry = name;
		justSelectedCountry = true;
		// Reset flag after a tick to allow clearCountry to be skipped
		setTimeout(() => (justSelectedCountry = false), 0);
	}

	function handleCountrySelect(country: string | null) {
		selectedCountry = country;
	}

	function clearCountry() {
		// Don't clear if we just selected a country (prevents immediate clearing)
		if (justSelectedCountry) return;
		selectedCountry = null;
	}
</script>

<div class="relative h-dvh w-screen overflow-hidden bg-black">
	<div class="absolute inset-0" onclick={clearCountry} onkeydown={(e) => e.key === 'Escape' && clearCountry()} role="button" tabindex="-1">
		<Scene>
			<SceneContent onCountryClick={selectCountry} {selectedCountry} />
		</Scene>
	</div>

	<!-- Artists Panel / Nav Menu -->
	<ArtistsPanel {selectedCountry} onCountrySelect={handleCountrySelect} />

	<!-- Footer -->
	<footer
		class="pointer-events-none absolute bottom-0 right-0 z-40 p-4 font-mono text-pink sm:bottom-0 sm:left-0 sm:right-auto sm:p-6"
	>
		<p class="text-[0.5rem] uppercase tracking-[0.2em] opacity-40">UNDERGROUND MUSIC · WORLDWIDE</p>
	</footer>
</div>
