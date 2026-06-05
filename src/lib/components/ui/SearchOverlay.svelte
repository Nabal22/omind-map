<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { searchAll, type SearchResult } from '$lib/utils/search';
	import {
		isSearchOpen,
		getSearchQuery,
		setSearchQuery,
		closeSearch
	} from '$lib/stores/search.svelte';
	import { haptic } from '$lib/utils/haptics';

	let inputEl = $state<HTMLInputElement | null>(null);

	const open = $derived(isSearchOpen());
	const query = $derived(getSearchQuery());

	const results = $derived(searchAll(query));
	const preview = $derived(results.slice(0, 5));

	$effect(() => {
		if (open) {
			setTimeout(() => inputEl?.focus(), 80);
		}
	});

	function handleResultClick(href: string) {
		haptic('medium');
		closeSearch();
		if (href.startsWith('/')) {
			goto(href);
		} else {
			window.open(href, '_blank', 'noopener,noreferrer');
		}
	}

	function handleViewAll() {
		haptic('medium');
		const q = query.trim();
		closeSearch();
		goto(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		handleViewAll();
	}

	function handleClose() {
		haptic('light');
		closeSearch();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSearch();
	}

	function kindLabel(kind: SearchResult['kind']): string {
		if (kind === 'artist') return 'Artist';
		if (kind === 'article') return 'Article';
		return 'WTFIS';
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
		<!-- Decorative stars (corners) -->
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
		<img
			src="/assets/star.png"
			alt=""
			aria-hidden="true"
			class="search-deco-star pointer-events-none absolute right-[14%] bottom-[18%] h-5 w-5 sm:right-[20%] sm:bottom-[22%] sm:h-7 sm:w-7"
			style="--bob-delay: -0.6s;"
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
			class="relative mb-6 flex items-center gap-3 sm:mb-10"
			in:scale={{ duration: 500, delay: 180, start: 0.7, easing: backOut }}
		>
			<img
				src="/assets/star.png"
				alt=""
				aria-hidden="true"
				class="search-deco-star h-10 w-10 sm:h-14 sm:w-14"
				style="--bob-delay: 0s;"
			/>
			<h2 class="text-3xl font-light tracking-tight text-black sm:text-5xl">Search</h2>
		</div>

		<!-- Search form -->
		<form
			onsubmit={handleSubmit}
			class="relative"
			in:scale={{ duration: 500, delay: 240, start: 0.85, easing: backOut }}
		>
			<div class="relative flex items-center border-b-2 border-black focus-within:border-pink">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:this={inputEl}
					value={query}
					oninput={(e) => setSearchQuery(e.currentTarget.value)}
					type="search"
					placeholder="Artists, articles, WTFIS..."
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
						aria-label="Clear"
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
		</form>

		<!-- Results -->
		<div class="relative mt-6 sm:mt-10">
			{#if !query}
				<p
					class="font-mono text-xs tracking-[0.2em] text-black/40 uppercase sm:text-sm"
					in:fade={{ duration: 200, delay: 300 }}
				>
					Type to explore the universe…
				</p>
			{:else if preview.length === 0}
				<p
					class="font-mono text-xs tracking-[0.2em] text-black/40 uppercase sm:text-sm"
					in:fade={{ duration: 200 }}
				>
					No results found
				</p>
			{:else}
				<ul class="divide-y divide-black/10 border-t border-b border-black/10">
					{#each preview as result, i (`${result.kind}-${result.id}`)}
						<li in:fade={{ duration: 200, delay: 60 * i }}>
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
								<span
									class="shrink-0 font-mono text-[0.55rem] tracking-[0.2em] text-pink-highlight uppercase sm:text-[0.65rem]"
								>
									{kindLabel(result.kind)}
								</span>
							</button>
						</li>
					{/each}
				</ul>

				{#if results.length > 0}
					<button
						type="button"
						onclick={handleViewAll}
						class="mt-4 flex w-full items-center justify-between gap-2 py-3 text-left font-mono text-xs tracking-[0.2em] text-pink-highlight uppercase focus-ring transition-colors hover:text-pink sm:text-sm"
					>
						<span>View all {results.length} result{results.length === 1 ? '' : 's'}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="square"
						>
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="13 6 19 12 13 18" />
						</svg>
					</button>
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
