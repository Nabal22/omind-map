<script lang="ts">
	import { fly } from 'svelte/transition';
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
	const preview = $derived(results.slice(0, 3));

	$effect(() => {
		if (open) {
			setTimeout(() => inputEl?.focus(), 30);
		}
	});

	function handleResultClick(href: string) {
		haptic('light');
		closeSearch();
		if (href.startsWith('/')) {
			goto(href);
		} else {
			window.open(href, '_blank', 'noopener,noreferrer');
		}
	}

	function handleViewAll() {
		haptic('light');
		const q = query.trim();
		closeSearch();
		goto(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		handleViewAll();
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
	<button
		type="button"
		class="fixed inset-0 z-[75] cursor-default bg-transparent sm:hidden"
		onclick={closeSearch}
		aria-label="Close search"
	></button>

	<div
		class="fixed inset-x-0 top-14 z-[76] border-b border-black/10 bg-white sm:hidden"
		transition:fly={{ y: -10, duration: 180 }}
	>
		<form onsubmit={handleSubmit} class="flex h-12 items-center gap-2 px-4">
			<span class="flex h-10 w-10 shrink-0 items-center justify-center text-black/50">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="square"
				>
					<circle cx="10.5" cy="10.5" r="6.5" />
					<line x1="15.5" y1="15.5" x2="20" y2="20" />
				</svg>
			</span>
			<input
				bind:this={inputEl}
				value={query}
				oninput={(e) => setSearchQuery(e.currentTarget.value)}
				type="search"
				placeholder="Search artists, articles, WTFIS..."
				class="h-10 min-w-0 flex-1 border-none bg-transparent font-mono text-sm leading-none text-black outline-none placeholder:text-black/30"
				autocomplete="off"
			/>
			{#if query}
				<button
					type="button"
					onclick={() => setSearchQuery('')}
					aria-label="Clear"
					class="flex h-10 w-10 shrink-0 items-center justify-center text-black/40 hover:text-black"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
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
		</form>

		{#if query}
			<div class="border-t border-black/10">
				{#if preview.length === 0}
					<p
						class="px-4 py-6 text-center font-mono text-xs tracking-[0.15em] text-black/40 uppercase"
					>
						No results
					</p>
				{:else}
					<ul>
						{#each preview as result (`${result.kind}-${result.id}`)}
							<li>
								<button
									type="button"
									onclick={() => handleResultClick(result.href)}
									class="flex w-full items-center justify-between gap-3 border-b border-black/5 px-4 py-3 text-left transition-colors hover:bg-black/5"
								>
									<div class="min-w-0 flex-1">
										<div
											class="truncate font-mono text-sm font-semibold tracking-[0.05em] text-black uppercase"
										>
											{result.title}
										</div>
										<div
											class="mt-0.5 truncate font-mono text-[0.6rem] tracking-[0.15em] text-black/50 uppercase"
										>
											{result.subtitle}
										</div>
									</div>
									<span
										class="shrink-0 font-mono text-[0.55rem] tracking-[0.2em] text-pink uppercase"
									>
										{kindLabel(result.kind)}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}

				{#if results.length > 0}
					<button
						type="button"
						onclick={handleViewAll}
						class="flex w-full items-center justify-between px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.15em] text-pink uppercase transition-colors hover:bg-black/5"
					>
						<span>View all {results.length} result{results.length === 1 ? '' : 's'}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
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
			</div>
		{/if}
	</div>
{/if}
