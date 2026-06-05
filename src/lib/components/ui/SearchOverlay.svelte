<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { searchArtists, listCountries } from '$lib/utils/search';
	import { CONTINENTS, getContinent, type Continent } from '$lib/utils/continents';
	import {
		isSearchOpen,
		getSearchQuery,
		setSearchQuery,
		getSearchCountry,
		setSearchCountry,
		getSearchContinent,
		setSearchContinent,
		clearSearchFilters,
		closeSearch
	} from '$lib/stores/search.svelte';
	import { haptic } from '$lib/utils/haptics';

	let inputEl = $state<HTMLInputElement | null>(null);
	let countryListOpen = $state(false);

	const open = $derived(isSearchOpen());
	const query = $derived(getSearchQuery());
	const country = $derived(getSearchCountry());
	const continent = $derived(getSearchContinent());

	const results = $derived(searchArtists(query, { country, continent }));
	const preview = $derived(results.slice(0, 6));

	const countries = $derived.by(() => {
		const all = listCountries();
		if (continent) return all.filter((c) => getContinent(c) === continent);
		return all;
	});

	const hasFilter = $derived(country !== null || continent !== null);

	$effect(() => {
		if (open) {
			setTimeout(() => inputEl?.focus(), 80);
		}
	});

	function handleResultClick(href: string) {
		haptic('medium');
		closeSearch();
		goto(href);
	}

	function handleClose() {
		haptic('light');
		closeSearch();
	}

	function toggleContinent(c: Continent) {
		haptic('light');
		setSearchContinent(continent === c ? null : c);
	}

	function selectCountry(name: string) {
		haptic('light');
		setSearchCountry(country === name ? null : name);
		countryListOpen = false;
	}

	function clearAll() {
		haptic('light');
		clearSearchFilters();
		setSearchQuery('');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSearch();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[85] bg-white/95 backdrop-blur-md"
		transition:fade={{ duration: 200, easing: cubicOut }}
	></div>

	<!-- Overlay content -->
	<div
		class="fixed inset-0 z-[86] flex flex-col items-stretch overflow-y-auto px-5 pt-16 pb-10 font-mono sm:px-12 sm:pt-24"
		in:fade={{ duration: 220, delay: 80, easing: cubicOut }}
		out:fade={{ duration: 140 }}
	>
		<!-- Decorative stars -->
		<img
			src="/assets/star.png"
			alt=""
			aria-hidden="true"
			class="search-deco-star pointer-events-none absolute top-[8%] right-[10%] h-7 w-7 sm:top-[12%] sm:right-[15%] sm:h-10 sm:w-10"
			style="--bob-delay: -1.4s;"
		/>
		<img
			src="/assets/star.png"
			alt=""
			aria-hidden="true"
			class="search-deco-star pointer-events-none absolute bottom-[10%] left-[8%] h-6 w-6 sm:bottom-[14%] sm:left-[12%] sm:h-9 sm:w-9"
			style="--bob-delay: -2.8s;"
		/>

		<!-- Close button -->
		<button
			type="button"
			onclick={handleClose}
			aria-label="Close search"
			class="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center text-black focus-ring transition-colors hover:text-pink-highlight sm:top-8 sm:right-8"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="square"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<!-- Heading -->
		<div
			class="relative mb-6 flex items-center gap-3 sm:mb-8"
			in:scale={{ duration: 500, delay: 180, start: 0.7, easing: backOut }}
		>
			<img
				src="/assets/star.png"
				alt=""
				aria-hidden="true"
				class="search-deco-star h-10 w-10 sm:h-14 sm:w-14"
				style="--bob-delay: 0s;"
			/>
			<h2 class="text-3xl font-light tracking-tight text-black sm:text-5xl">Artists</h2>
		</div>

		<!-- Search input -->
		<div class="relative" in:scale={{ duration: 500, delay: 240, start: 0.85, easing: backOut }}>
			<div class="relative flex items-center border-b-2 border-black focus-within:border-pink">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:this={inputEl}
					value={query}
					oninput={(e) => setSearchQuery(e.currentTarget.value)}
					type="search"
					placeholder="Type an artist name..."
					class="h-14 w-full border-none bg-transparent pr-10 font-mono text-xl text-black outline-none placeholder:text-black/25 sm:h-20 sm:text-3xl"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					autofocus
				/>
				{#if query}
					<button
						type="button"
						onclick={() => setSearchQuery('')}
						aria-label="Clear query"
						class="absolute right-0 flex h-12 w-12 items-center justify-center text-black/40 transition-colors hover:text-pink-highlight"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="square"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Continent chips -->
		<div class="mt-5 sm:mt-7" in:fade={{ duration: 300, delay: 320 }}>
			<p class="mb-2 text-[0.6rem] tracking-[0.2em] text-black/40 uppercase sm:text-[0.65rem]">
				Continent
			</p>
			<div class="flex flex-wrap gap-2">
				{#each CONTINENTS as c (c)}
					<button
						type="button"
						onclick={() => toggleContinent(c)}
						class="rounded-full border px-3 py-1.5 text-xs tracking-wide focus-ring transition-colors sm:text-sm {continent ===
						c
							? 'border-pink bg-pink/20 text-black'
							: 'border-black/20 text-black/70 hover:border-pink hover:text-pink-highlight'}"
					>
						{c}
					</button>
				{/each}
			</div>
		</div>

		<!-- Country picker -->
		<div class="mt-4 sm:mt-5" in:fade={{ duration: 300, delay: 380 }}>
			<div class="mb-2 flex items-center justify-between">
				<p class="text-[0.6rem] tracking-[0.2em] text-black/40 uppercase sm:text-[0.65rem]">
					Country
				</p>
				{#if hasFilter || query}
					<button
						type="button"
						onclick={clearAll}
						class="text-[0.6rem] tracking-[0.15em] text-pink-highlight uppercase focus-ring transition-colors hover:text-pink sm:text-[0.65rem]"
					>
						Clear all
					</button>
				{/if}
			</div>
			<button
				type="button"
				onclick={() => (countryListOpen = !countryListOpen)}
				aria-expanded={countryListOpen}
				class="flex w-full items-center justify-between gap-2 rounded-md border border-black/20 px-3 py-2 text-left text-sm focus-ring transition-colors hover:border-pink sm:text-base {country
					? 'text-black'
					: 'text-black/50'}"
			>
				<span class="truncate">{country ?? 'Any country'}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="square"
					class="shrink-0 transition-transform {countryListOpen ? 'rotate-180' : ''}"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>
			{#if countryListOpen}
				<ul
					class="mt-2 max-h-44 overflow-y-auto rounded-md border border-black/10 bg-white shadow-sm"
					transition:fade={{ duration: 120 }}
				>
					{#each countries as c (c)}
						<li>
							<button
								type="button"
								onclick={() => selectCountry(c)}
								class="flex w-full items-center justify-between px-3 py-2 text-left text-sm focus-ring transition-colors hover:bg-pink/10 {country ===
								c
									? 'text-pink-highlight'
									: 'text-black'}"
							>
								<span>{c}</span>
								{#if country === c}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
									>
										<polyline points="4 12 10 18 20 6" />
									</svg>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Results -->
		<div class="relative mt-6 sm:mt-8">
			<p
				class="mb-3 text-[0.6rem] tracking-[0.2em] text-black/40 uppercase sm:text-[0.65rem]"
				in:fade={{ duration: 200, delay: 440 }}
			>
				{results.length} artist{results.length === 1 ? '' : 's'}
			</p>
			{#if preview.length === 0}
				<p
					class="text-xs tracking-[0.15em] text-black/40 uppercase sm:text-sm"
					in:fade={{ duration: 200 }}
				>
					No artist matches.
				</p>
			{:else}
				<ul class="divide-y divide-black/10 border-t border-b border-black/10">
					{#each preview as result, i (result.id)}
						<li in:fade={{ duration: 200, delay: 40 * i }}>
							<button
								type="button"
								onclick={() => handleResultClick(result.href)}
								class="group flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-pink/10 sm:gap-4 sm:py-4"
							>
								<img
									src="/assets/star.png"
									alt=""
									aria-hidden="true"
									class="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-125 sm:h-6 sm:w-6"
								/>
								<div class="min-w-0 flex-1">
									<div class="truncate text-base font-medium text-black sm:text-lg">
										{result.title}
									</div>
									<div
										class="mt-0.5 truncate font-mono text-[0.6rem] tracking-[0.15em] text-black/50 uppercase sm:text-[0.65rem]"
									>
										{result.subtitle}
									</div>
								</div>
							</button>
						</li>
					{/each}
				</ul>

				{#if results.length > preview.length}
					<p class="mt-3 text-[0.6rem] tracking-[0.15em] text-black/40 uppercase sm:text-xs">
						+ {results.length - preview.length} more
					</p>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	.search-deco-star {
		filter: drop-shadow(0 0 6px rgba(255, 174, 251, 0.55));
		animation:
			search-bob 5s ease-in-out var(--bob-delay, 0s) infinite alternate,
			search-twinkle 3s ease-in-out var(--bob-delay, 0s) infinite,
			search-spin 42s linear infinite;
		transform-origin: center;
		will-change: transform, filter;
	}

	@keyframes search-bob {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-4px);
		}
	}

	@keyframes search-twinkle {
		0%,
		100% {
			opacity: 0.85;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes search-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-deco-star {
			animation: none !important;
		}
	}
</style>
