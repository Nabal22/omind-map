<script lang="ts">
	import { page } from '$app/state';
	import { goto, replaceState } from '$app/navigation';
	import { searchAll, type SearchResult } from '$lib/utils/search';
	import { SITE_NAME } from '$lib/config';
	import { haptic } from '$lib/utils/haptics';

	let query = $state(page.url.searchParams.get('q') ?? '');

	$effect(() => {
		const current = page.url.searchParams.get('q') ?? '';
		if (current !== query) query = current;
	});

	const results = $derived(searchAll(query));

	const grouped = $derived.by(() => {
		const groups: Record<SearchResult['kind'], SearchResult[]> = {
			artist: [],
			article: [],
			wtfis: []
		};
		for (const r of results) groups[r.kind].push(r);
		return groups;
	});

	function updateUrl(value: string) {
		const url = new URL(page.url);
		if (value) url.searchParams.set('q', value);
		else url.searchParams.delete('q');
		replaceState(url, page.state);
	}

	function handleInput(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		query = value;
		updateUrl(value);
	}

	function handleResultClick(href: string) {
		haptic('light');
		if (href.startsWith('/')) goto(href);
		else window.open(href, '_blank', 'noopener,noreferrer');
	}

	function kindLabel(kind: SearchResult['kind']): string {
		if (kind === 'artist') return 'Artists';
		if (kind === 'article') return 'Articles';
		return 'WTFIS';
	}
</script>

<svelte:head>
	<title>Search — {SITE_NAME}</title>
	<meta name="description" content="Search artists, articles, and WTFIS on {SITE_NAME}." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-nav-safe pb-nav-safe sm:pt-8">
		<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">SEARCH</h1>

		<div class="mt-6 flex items-center gap-3 border-b border-black/40 pb-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="square"
				class="shrink-0 text-black/50"
			>
				<circle cx="10.5" cy="10.5" r="6.5" />
				<line x1="15.5" y1="15.5" x2="20" y2="20" />
			</svg>
			<input
				value={query}
				oninput={handleInput}
				type="search"
				placeholder="Search artists, articles, WTFIS..."
				class="flex-1 border-none bg-transparent font-mono text-base text-black outline-none placeholder:text-black/30"
				autocomplete="off"
			/>
		</div>

		{#if !query}
			<p class="mt-8 text-[0.75rem] text-black/50">Type to search across the site.</p>
		{:else if results.length === 0}
			<p class="mt-8 text-[0.75rem] text-black/50">No results for &ldquo;{query}&rdquo;.</p>
		{:else}
			<p class="mt-6 text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">
				{results.length} result{results.length === 1 ? '' : 's'}
			</p>

			{#each ['artist', 'article', 'wtfis'] as kind (kind)}
				{@const list = grouped[kind as SearchResult['kind']]}
				{#if list.length > 0}
					<section class="mt-8">
						<h2 class="text-[0.65rem] font-bold tracking-[0.2em] text-black/40 uppercase">
							{kindLabel(kind as SearchResult['kind'])} · {list.length}
						</h2>
						<ul class="mt-3 border-t border-black/10">
							{#each list as result (`${result.kind}-${result.id}`)}
								<li>
									<button
										type="button"
										onclick={() => handleResultClick(result.href)}
										class="flex w-full items-center justify-between gap-3 border-b border-black/10 py-3 text-left transition-opacity hover:opacity-60"
									>
										<div class="min-w-0 flex-1">
											<div
												class="truncate text-sm font-semibold tracking-[0.05em] text-black uppercase"
											>
												{result.title}
											</div>
											<div
												class="mt-0.5 truncate text-[0.6rem] tracking-[0.15em] text-black/50 uppercase"
											>
												{result.subtitle}
											</div>
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="square"
											class="shrink-0 text-black/40"
										>
											<line x1="5" y1="12" x2="19" y2="12" />
											<polyline points="13 6 19 12 13 18" />
										</svg>
									</button>
								</li>
							{/each}
						</ul>
					</section>
				{/if}
			{/each}
		{/if}
	</div>
</div>
