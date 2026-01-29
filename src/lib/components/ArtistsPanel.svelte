<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { untrack } from 'svelte';
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		onCountrySelect: (country: string | null) => void;
	}

	let { selectedCountry, onCountrySelect }: Props = $props();

	// Selected artist for detail view
	let selectedArtist = $state<Artist | null>(null);

	// Country tag button refs for scrolling into view
	let countryTagRefs: Record<string, HTMLButtonElement> = {};

	// Reset to list view and scroll tag into view when country changes
	$effect(() => {
		const country = selectedCountry;
		untrack(() => {
			selectedArtist = null;
			// Scroll the selected country tag into view
			if (country && countryTagRefs[country]) {
				countryTagRefs[country].scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center'
				});
			}
		});
	});

	// Cache for loaded iframes - persists across artist changes (module-level)
	const loadedIframes = new SvelteSet<string>();

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	// Get unique countries from artists
	const countries = [...new Set(artists.map((a) => a.country))].sort();

	// Filter artists based on selected country
	const filteredArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : artists
	);

	function handleTagClick(country: string) {
		if (selectedCountry === country) {
			onCountrySelect(null);
		} else {
			onCountrySelect(country);
		}
	}

	function selectArtist(artist: Artist) {
		selectedArtist = artist;
	}

	function goBackToList() {
		selectedArtist = null;
	}
</script>

<div class="pointer-events-auto font-mono text-pink">
	{#if selectedArtist}
		<!-- Artist Detail View -->
		<div
			class="w-[calc(100vw-2rem)] max-w-xs rounded border border-pink/30 bg-black/60 p-3 backdrop-blur-sm sm:max-w-sm sm:p-4"
		>
			<button
				class="mb-2 cursor-pointer bg-transparent p-0 font-mono text-[0.65rem] text-pink opacity-70 transition-all hover:opacity-100 hover:[text-shadow:0_0_8px_#ffaef6] sm:mb-3 sm:text-xs"
				onclick={goBackToList}
			>
				[← BACK]
			</button>

			<p class="mb-0.5 text-[0.5rem] tracking-[0.2em] opacity-60 sm:mb-1 sm:text-[0.55rem]">
				WHERE THE FUCK IS
			</p>
			<h2
				class="mb-2 text-base font-bold uppercase [text-shadow:0_0_10px_#ffaef6] sm:mb-3 sm:text-lg"
			>
				{selectedArtist.name}
			</h2>

			<div class="space-y-0.5 text-[0.65rem] leading-snug sm:space-y-1 sm:text-[0.75rem]">
				<p><span class="opacity-50">COUNTRY:</span> {selectedArtist.country}</p>
				<p><span class="opacity-50">BIO:</span> {selectedArtist.description}</p>
			</div>

			<div class="mt-2 mb-2 sm:mt-3 sm:mb-3">
				<p class="mb-1 text-[0.6rem] sm:text-[0.7rem]"><span class="opacity-50">TOP3:</span></p>
				{#each selectedArtist.soundcloudUrl ?? [] as url (url)}
					<div class="relative min-h-5 py-0.5">
						{#if !loadedIframes.has(url)}
							<div class="glitch-loader absolute inset-0 flex items-center">
								<span class="glitch-text text-[0.55rem] tracking-[0.15em] opacity-70 sm:text-[0.6rem]"
									>LOADING_</span
								>
							</div>
						{/if}
						<iframe
							title="{selectedArtist.name} on SoundCloud"
							scrolling="no"
							allow="autoplay"
							width="100%"
							height="20"
							src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaef6&auto_play=false&show_user=false&show_artwork=false`}
							class="transition-opacity duration-300 {loadedIframes.has(url)
								? 'opacity-100'
								: 'opacity-0'}"
							onload={() => handleIframeLoad(url)}
						></iframe>
					</div>
				{/each}
			</div>

			<a
				class="inline-block border border-pink/60 px-2 py-1 text-[0.65rem] text-pink no-underline transition-all duration-200 hover:border-pink hover:bg-pink hover:text-black hover:shadow-[0_0_15px_#ffaef6] sm:px-3 sm:py-1.5 sm:text-[0.75rem]"
				href={selectedArtist.musicUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				[ LISTEN → ]
			</a>
		</div>
	{:else}
		<!-- Country Tags Navbar -->
		<nav class="mb-2 max-w-[calc(100vw-2rem)] sm:mb-3 sm:max-w-md md:max-w-lg">
			<div class="scrollbar-hide flex gap-1 overflow-x-auto pb-1 sm:gap-1.5">
				<button
					class="shrink-0 cursor-pointer border px-1.5 py-0.5 text-[0.5rem] uppercase tracking-wider transition-all sm:px-2 sm:py-1 sm:text-[0.6rem] {!selectedCountry
						? 'border-pink bg-pink/90 text-black'
						: 'border-pink/30 bg-black/40 text-pink hover:border-pink/60 hover:bg-black/60'}"
					onclick={() => onCountrySelect(null)}
				>
					All
				</button>

				{#each countries as country (country)}
					{@const isActive = selectedCountry === country}
					{@const count = artists.filter((a) => a.country === country).length}
					<button
						bind:this={countryTagRefs[country]}
						class="shrink-0 cursor-pointer border px-1.5 py-0.5 text-[0.5rem] uppercase tracking-wider transition-all sm:px-2 sm:py-1 sm:text-[0.6rem] {isActive
							? 'border-pink bg-pink/90 text-black'
							: 'border-pink/30 bg-black/40 text-pink hover:border-pink/60 hover:bg-black/60'}"
						onclick={() => handleTagClick(country)}
					>
						{country.length > 10 ? country.slice(0, 8) + '..' : country}
						<span class="ml-0.5 opacity-60">({count})</span>
					</button>
				{/each}
			</div>
		</nav>

		<!-- Artists List - horizontal scroll on mobile, wrap on desktop -->
		<div
			class="scrollbar-hide flex max-w-[calc(100vw-2rem)] gap-1 overflow-x-auto pb-1 sm:max-w-md sm:flex-wrap sm:gap-1.5 md:max-w-lg"
		>
			{#each filteredArtists as artist (artist.id)}
				<button
					class="shrink-0 cursor-pointer bg-black/40 px-2 py-1 text-[0.55rem] font-bold uppercase text-pink backdrop-blur-sm transition-all hover:bg-black/60 sm:px-2.5 sm:py-1.5 sm:text-[0.6rem]"
					onclick={() => selectArtist(artist)}
				>
					{artist.name}
				</button>
			{/each}
		</div>

		<!-- Count -->
		<p class="mt-1.5 text-[0.45rem] tracking-[0.15em] uppercase opacity-40 sm:mt-2 sm:text-[0.5rem]">
			{filteredArtists.length} ARTIST{filteredArtists.length !== 1 ? 'S' : ''}
		</p>
	{/if}
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	.glitch-loader {
		animation: flicker 0.15s infinite;
	}

	.glitch-text {
		position: relative;
		color: #ffaef6;
		animation: glitch-skew 1s infinite linear alternate-reverse;
	}

	.glitch-text::before,
	.glitch-text::after {
		content: 'LOADING_';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.glitch-text::before {
		color: #0ff;
		animation: glitch-anim 0.3s infinite linear alternate-reverse;
		clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
	}

	.glitch-text::after {
		color: #f0f;
		animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
		clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
	}

	@keyframes flicker {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
		75% {
			opacity: 0.9;
		}
	}

	@keyframes glitch-anim {
		0% {
			transform: translate(0);
		}
		20% {
			transform: translate(-2px, 1px);
		}
		40% {
			transform: translate(-2px, -1px);
		}
		60% {
			transform: translate(2px, 1px);
		}
		80% {
			transform: translate(2px, -1px);
		}
		100% {
			transform: translate(0);
		}
	}

	@keyframes glitch-anim-2 {
		0% {
			transform: translate(0);
		}
		20% {
			transform: translate(2px, -1px);
		}
		40% {
			transform: translate(2px, 1px);
		}
		60% {
			transform: translate(-2px, -1px);
		}
		80% {
			transform: translate(-2px, 1px);
		}
		100% {
			transform: translate(0);
		}
	}

	@keyframes glitch-skew {
		0% {
			transform: skew(0deg);
		}
		20% {
			transform: skew(-1deg);
		}
		40% {
			transform: skew(1deg);
		}
		60% {
			transform: skew(0deg);
		}
		80% {
			transform: skew(-1deg);
		}
		100% {
			transform: skew(0deg);
		}
	}
</style>
