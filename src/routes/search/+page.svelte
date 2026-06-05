<script lang="ts">
	import { page } from '$app/state';
	import { goto, replaceState } from '$app/navigation';
	import { searchArtists, listCountries } from '$lib/utils/search';
	import { CONTINENTS, getContinent, type Continent } from '$lib/utils/continents';
	import { SITE_NAME } from '$lib/config';
	import { haptic } from '$lib/utils/haptics';

	let query = $state(page.url.searchParams.get('q') ?? '');
	let continent = $state<Continent | null>(
		(page.url.searchParams.get('continent') as Continent | null) ?? null
	);
	let country = $state<string | null>(page.url.searchParams.get('country'));

	$effect(() => {
		const q = page.url.searchParams.get('q') ?? '';
		if (q !== query) query = q;
	});

	const results = $derived(searchArtists(query, { country, continent }));

	const countries = $derived.by(() => {
		const all = listCountries();
		if (continent) return all.filter((c) => getContinent(c) === continent);
		return all;
	});

	function updateUrl() {
		const url = new URL(page.url);
		if (query) url.searchParams.set('q', query);
		else url.searchParams.delete('q');
		if (continent) url.searchParams.set('continent', continent);
		else url.searchParams.delete('continent');
		if (country) url.searchParams.set('country', country);
		else url.searchParams.delete('country');
		replaceState(url, page.state);
	}

	function handleInput(e: Event) {
		query = (e.currentTarget as HTMLInputElement).value;
		updateUrl();
	}

	function toggleContinent(c: Continent) {
		haptic('light');
		continent = continent === c ? null : c;
		if (continent) country = null;
		updateUrl();
	}

	function selectCountry(c: string) {
		haptic('light');
		country = country === c ? null : c;
		updateUrl();
	}

	function clearAll() {
		query = '';
		continent = null;
		country = null;
		updateUrl();
	}

	function handleResultClick(href: string) {
		haptic('medium');
		goto(href);
	}
</script>

<svelte:head>
	<title>Search Artists — {SITE_NAME}</title>
	<meta
		name="description"
		content="Search artists on {SITE_NAME} by name, country, or continent."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-3xl px-6 pt-nav-safe pb-nav-safe">
		<div class="flex items-center gap-3">
			<img src="/assets/star.png" alt="" aria-hidden="true" class="h-8 w-8 sm:h-10 sm:w-10" />
			<h1 class="text-2xl font-light tracking-tight text-pretty sm:text-4xl">Artists</h1>
		</div>

		<div class="mt-6 flex items-center gap-3 border-b-2 border-black pb-2">
			<input
				value={query}
				oninput={handleInput}
				type="search"
				placeholder="Type an artist name..."
				class="flex-1 border-none bg-transparent font-mono text-lg text-black outline-none placeholder:text-black/30 sm:text-2xl"
				autocomplete="off"
			/>
		</div>

		<div class="mt-5">
			<p class="mb-2 text-[0.6rem] tracking-[0.2em] text-black/40 uppercase">Continent</p>
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

		<div class="mt-4">
			<div class="mb-2 flex items-center justify-between">
				<p class="text-[0.6rem] tracking-[0.2em] text-black/40 uppercase">Country</p>
				{#if query || continent || country}
					<button
						type="button"
						onclick={clearAll}
						class="text-[0.6rem] tracking-[0.15em] text-pink-highlight uppercase focus-ring transition-colors hover:text-pink"
					>
						Clear all
					</button>
				{/if}
			</div>
			<div class="flex flex-wrap gap-2">
				{#each countries as c (c)}
					<button
						type="button"
						onclick={() => selectCountry(c)}
						class="rounded-full border px-3 py-1 text-xs tracking-wide focus-ring transition-colors {country ===
						c
							? 'border-pink bg-pink/20 text-black'
							: 'border-black/15 text-black/60 hover:border-pink hover:text-pink-highlight'}"
					>
						{c}
					</button>
				{/each}
			</div>
		</div>

		<p class="mt-6 text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">
			{results.length} artist{results.length === 1 ? '' : 's'}
		</p>

		{#if results.length === 0}
			<p class="mt-6 text-[0.75rem] text-black/50">No artists match these filters.</p>
		{:else}
			<ul class="mt-3 divide-y divide-black/10 border-t border-b border-black/10">
				{#each results as result (result.id)}
					<li>
						<button
							type="button"
							onclick={() => handleResultClick(result.href)}
							class="group flex w-full items-center gap-3 py-3 text-left focus-ring transition-colors hover:bg-pink/10 sm:gap-4 sm:py-4"
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
									class="mt-0.5 truncate text-[0.6rem] tracking-[0.15em] text-black/50 uppercase"
								>
									{result.subtitle}
								</div>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
