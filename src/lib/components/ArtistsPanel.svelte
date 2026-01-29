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
			if (country && countryTagRefs[country]) {
				countryTagRefs[country].scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center'
				});
			}
		});
	});

	// Cache for loaded iframes
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

{#if selectedArtist}
	<!-- Artist Detail Popup -->
	<div
		class="fixed inset-x-4 bottom-4 z-50 border border-pink/30 bg-black/90 p-4 font-mono text-pink backdrop-blur-sm sm:inset-auto sm:top-6 sm:left-6 sm:max-w-sm sm:border-pink/20 sm:bg-black/80"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.key === 'Escape' && goBackToList()}
		role="dialog"
		tabindex="-1"
	>
		<button
			class="mb-3 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.7rem] text-pink opacity-70 transition-all hover:opacity-100 hover:[text-shadow:0_0_8px_#ffaef6]"
			onclick={goBackToList}
		>
			[← BACK]
		</button>

		<p class="mb-1 text-[0.55rem] tracking-[0.2em] opacity-60">WHERE THE FUCK IS</p>
		<h2 class="mb-3 text-lg font-bold uppercase [text-shadow:0_0_10px_#ffaef6]">
			{selectedArtist.name}
		</h2>

		<div class="space-y-1 text-[0.75rem] leading-snug">
			<p><span class="opacity-50">COUNTRY:</span> {selectedArtist.country}</p>
			<p><span class="opacity-50">BIO:</span> {selectedArtist.description}</p>
		</div>

		<div class="mt-3 mb-3">
			<p class="mb-1 text-[0.7rem]"><span class="opacity-50">TOP3:</span></p>
			{#each selectedArtist.soundcloudUrl ?? [] as url (url)}
				<div class="relative min-h-5 py-0.5">
					{#if !loadedIframes.has(url)}
						<div class="glitch-loader absolute inset-0 flex items-center">
							<span class="glitch-text text-[0.6rem] tracking-[0.15em] opacity-70">LOADING_</span>
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
			class="inline-block border border-pink/60 px-3 py-1.5 text-[0.75rem] text-pink no-underline transition-all duration-200 hover:border-pink hover:bg-pink hover:text-black hover:shadow-[0_0_15px_#ffaef6]"
			href={selectedArtist.musicUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			[ LISTEN → ]
		</a>
	</div>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events a11y_no_redundant_roles -->
	<nav
		class="fixed bottom-0 left-0 right-0 z-50 border-t border-pink/20 bg-black/85 px-4 py-3 font-mono backdrop-blur-sm
			sm:bottom-auto sm:right-auto sm:top-6 sm:left-6 sm:border-t-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Title - desktop only -->
		<h2 class="mb-3 hidden text-[0.65rem] uppercase tracking-[0.2em] text-pink opacity-70 sm:block">
			WHERE THE FUCK IS :
		</h2>

		<!-- Country Tags -->
		<div
			class="mb-2 flex flex-row gap-1 overflow-x-auto [scrollbar-width:none] sm:mb-3 sm:flex-wrap sm:gap-1.5 sm:overflow-x-visible"
		>
			<button
				class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-150
					{!selectedCountry
					? 'opacity-100 [text-shadow:0_0_8px_#ffaef6]'
					: 'opacity-50 hover:opacity-80'}"
				onclick={() => onCountrySelect(null)}
			>
				[ALL]
			</button>
			{#each countries as country (country)}
				{@const isActive = selectedCountry === country}
				<button
					bind:this={countryTagRefs[country]}
					class="shrink-0 cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-[0.6rem] uppercase text-pink transition-all duration-150
						{isActive
						? 'opacity-100 [text-shadow:0_0_8px_#ffaef6]'
						: 'opacity-50 hover:opacity-80'}"
					onclick={() => handleTagClick(country)}
				>
					[{country.length > 8 ? country.slice(0, 6) + '..' : country}]
				</button>
			{/each}
		</div>

		<!-- Artists List -->
		<ul
			class="flex flex-row gap-0 overflow-x-auto [scrollbar-width:none]
				sm:flex-col sm:gap-[0.2rem] sm:overflow-x-visible"
		>
			{#each filteredArtists as artist (artist.id)}
				<li>
					<button
						class="cursor-pointer whitespace-nowrap border-b-2 border-b-transparent border-none bg-transparent px-3 py-[0.4rem] text-left font-mono text-[0.75rem] uppercase text-pink transition-all duration-150 hover:border-b-pink
							sm:border-b-0 sm:border-l-2 sm:border-l-transparent sm:px-2 sm:py-[0.3rem] sm:text-[0.85rem] sm:hover:border-b-0 sm:hover:border-l-pink sm:hover:pl-4 sm:hover:[text-shadow:0_0_8px_#ffaef6]"
						onclick={() => selectArtist(artist)}
					>
						{artist.name}
					</button>
				</li>
			{/each}
		</ul>

		<!-- Count - mobile only -->
		<p class="mt-2 text-[0.5rem] uppercase tracking-[0.15em] text-pink opacity-40 sm:hidden">
			{filteredArtists.length} ARTIST{filteredArtists.length !== 1 ? 'S' : ''}
		</p>
	</nav>
{/if}

<style>
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
