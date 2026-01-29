<script lang="ts">
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
		onArtistClick: (artist: Artist) => void;
		onClose: () => void;
	}

	let { selectedCountry, onCountrySelect, onArtistClick, onClose }: Props = $props();

	// Get unique countries from artists
	const countries = [...new Set(artists.map((a) => a.country))].sort();

	// Filter artists based on selected country
	const filteredArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : artists
	);

	function handleTagClick(country: string) {
		if (selectedCountry === country) {
			onCountrySelect(null); // Deselect if clicking same tag
		} else {
			onCountrySelect(country);
		}
	}
</script>

<div class="fixed inset-x-0 bottom-0 z-50 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-96">
	<!-- Backdrop for mobile -->
	<button
		class="fixed inset-0 bg-black/60 sm:hidden"
		onclick={onClose}
		aria-label="Close panel"
	></button>

	<!-- Panel -->
	<div
		class="relative flex h-[70vh] flex-col border-t-2 border-pink bg-black/95 font-mono text-pink shadow-[0_0_30px_rgba(255,174,246,0.2)] sm:h-full sm:border-l-2 sm:border-t-0"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-pink/20 p-4">
			<div>
				<p class="text-[0.6rem] tracking-[0.25em] uppercase opacity-50">EXPLORE</p>
				<h2 class="text-lg font-bold tracking-wide uppercase [text-shadow:0_0_10px_#ffaef6]">
					ARTISTS
				</h2>
			</div>
			<button
				class="cursor-pointer bg-transparent p-1 font-mono text-sm text-pink transition-all hover:[text-shadow:0_0_8px_#ffaef6]"
				onclick={onClose}
			>
				[X]
			</button>
		</div>

		<!-- Country Tags Navbar -->
		<nav class="border-b border-pink/20 p-3">
			<div class="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
				<!-- All tag -->
				<button
					class="shrink-0 cursor-pointer border px-3 py-1.5 text-[0.65rem] uppercase tracking-wider transition-all {!selectedCountry
						? 'border-pink bg-pink text-black'
						: 'border-pink/40 bg-transparent text-pink hover:border-pink hover:bg-pink/10'}"
					onclick={() => onCountrySelect(null)}
				>
					All
				</button>

				<!-- Country tags -->
				{#each countries as country (country)}
					{@const isActive = selectedCountry === country}
					{@const count = artists.filter((a) => a.country === country).length}
					<button
						class="shrink-0 cursor-pointer border px-3 py-1.5 text-[0.65rem] uppercase tracking-wider transition-all {isActive
							? 'border-pink bg-pink text-black'
							: 'border-pink/40 bg-transparent text-pink hover:border-pink hover:bg-pink/10'}"
						onclick={() => handleTagClick(country)}
					>
						{country.length > 15 ? country.slice(0, 12) + '...' : country}
						<span class="ml-1 opacity-60">({count})</span>
					</button>
				{/each}
			</div>
		</nav>

		<!-- Artists List -->
		<div class="flex-1 overflow-y-auto p-3">
			<div class="space-y-2">
				{#each filteredArtists as artist (artist.id)}
					<button
						class="group flex w-full cursor-pointer items-center gap-3 border border-pink/40 bg-transparent p-3 text-left font-mono text-pink transition-all hover:border-pink hover:bg-pink/10"
						onclick={() => onArtistClick(artist)}
					>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center border border-pink/60 text-[0.6rem] transition-all group-hover:bg-pink group-hover:text-black"
						>
							►
						</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold uppercase">{artist.name}</p>
							<p class="truncate text-[0.65rem] opacity-60">{artist.description}</p>
							<p class="mt-0.5 text-[0.55rem] uppercase tracking-wider opacity-40">
								{artist.country}
							</p>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="border-t border-pink/20 p-3">
			<p class="text-[0.55rem] tracking-[0.2em] uppercase opacity-40">
				{filteredArtists.length} ARTIST{filteredArtists.length !== 1 ? 'S' : ''}
				{selectedCountry ? `FROM ${selectedCountry.toUpperCase()}` : 'WORLDWIDE'}
			</p>
		</div>
	</div>
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
