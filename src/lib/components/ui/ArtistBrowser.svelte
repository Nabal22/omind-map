<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { artists, type Artist } from '$lib/data/artists';
	import { createSwipeToDismiss } from '$lib/utils/touch.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		onArtistSelect: (artist: Artist) => void;
	}

	let { open, onClose, onArtistSelect }: Props = $props();

	let searchQuery = $state('');
	let mounted = $state(false);
	let searchInput = $state<HTMLInputElement | null>(null);

	// Keep mounted slightly after close for exit animation
	$effect(() => {
		if (open) {
			mounted = true;
			setTimeout(() => searchInput?.focus(), 350);
		} else {
			const timeout = setTimeout(() => {
				mounted = false;
				searchQuery = '';
			}, 300);
			return () => clearTimeout(timeout);
		}
	});

	// Group artists by country, sorted alphabetically
	const groupedArtists = $derived.by(() => {
		const query = searchQuery.toLowerCase().trim();
		const filtered = query
			? artists.filter(
					(a) => a.name.toLowerCase().includes(query) || a.country.toLowerCase().includes(query)
				)
			: artists;

		const groups = new SvelteMap<string, Artist[]>();
		for (const artist of filtered) {
			const list = groups.get(artist.country);
			if (list) {
				list.push(artist);
			} else {
				groups.set(artist.country, [artist]);
			}
		}

		// Sort countries alphabetically, and artists within each country
		const sorted = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
		for (const [, list] of sorted) {
			list.sort((a, b) => a.name.localeCompare(b.name));
		}

		return sorted;
	});

	const totalResults = $derived(groupedArtists.reduce((sum, [, list]) => sum + list.length, 0));

	function handleSelect(artist: Artist) {
		onArtistSelect(artist);
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	// Swipe-to-dismiss (mobile)
	const swipe = createSwipeToDismiss(() => onClose());
</script>

{#if mounted || open}
	<!-- Mobile backdrop -->
	<button
		class="fixed inset-0 z-[60] border-none bg-black/30 p-0 transition-opacity duration-200 sm:hidden
			{open ? 'opacity-100' : 'pointer-events-none opacity-0'}"
		onclick={onClose}
		aria-label="Close artist browser"
	></button>

	<!-- Mobile: bottom sheet -->
	<div
		class="fixed inset-x-0 bottom-0 z-[61] flex max-h-[85dvh] min-h-[85dvh] touch-manipulation flex-col overscroll-contain rounded-t-2xl bg-white font-mono sm:hidden
			{open ? '' : 'pointer-events-none'}"
		style="transform: translateY({open ? `${swipe.dragY}px` : '100%'}); opacity: {open
			? 1 - swipe.progress * 0.4
			: 0}; transition: {swipe.dragging
			? 'none'
			: 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease'};"
		onkeydown={handleKeydown}
		use:swipe.action
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar -->
		<div class="flex shrink-0 justify-center py-2.5">
			<div class="h-1 w-10 rounded-full bg-black/15"></div>
		</div>

		<!-- Search -->
		<div class="shrink-0 px-4 pb-3">
			<div class="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="shrink-0 text-black/30"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					bind:this={searchInput}
					bind:value={searchQuery}
					type="text"
					placeholder="Search artists or countries..."
					class="w-full border-none bg-transparent font-mono text-base text-black/80 outline-none placeholder:text-black/30"
				/>
				{#if searchQuery}
					<button
						class="shrink-0 cursor-pointer border-none bg-transparent p-0 text-black/30 transition-colors hover:text-black/60"
						onclick={() => (searchQuery = '')}
						aria-label="Clear search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				{/if}
			</div>
			{#if searchQuery}
				<p class="mt-1.5 text-[0.6rem] text-black/30">
					{totalResults} result{totalResults !== 1 ? 's' : ''}
				</p>
			{/if}
		</div>

		<!-- Artist list -->
		<div
			class="overflow-y-auto px-4 pb-safe"
			style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 0px))"
		>
			{#each groupedArtists as [country, countryArtists] (country)}
				<div class="mb-4">
					<h3
						class="sticky top-0 z-10 bg-white pt-2 pb-1.5 text-[0.6rem] font-bold tracking-[0.15em] text-black/40 uppercase"
					>
						{country}
					</h3>
					<ul class="space-y-0">
						{#each countryArtists as artist (artist.id)}
							<li>
								<button
									class="min-h-[44px] w-full cursor-pointer border-b border-black/5 bg-transparent py-2.5 text-left font-mono transition-colors duration-150 hover:opacity-60"
									onclick={() => handleSelect(artist)}
								>
									<span class="text-xs tracking-[0.05em] text-pink uppercase">{artist.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			{#if groupedArtists.length === 0}
				<p class="py-8 text-center text-[0.7rem] text-black/30">No artists found</p>
			{/if}
		</div>
	</div>

	<!-- Desktop: left panel -->
	<div
		class="fixed inset-y-0 left-0 z-[60] hidden w-80 flex-col border-r border-black/10 bg-white font-mono sm:flex
			{open ? '' : 'pointer-events-none'}"
		style="transform: translateX({open ? '0' : '-100%'}); opacity: {open
			? 1
			: 0}; transition: transform 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease;"
		onkeydown={handleKeydown}
		role="dialog"
		tabindex="-1"
	>
		<!-- Header -->
		<div class="flex shrink-0 items-center justify-between border-b border-black/10 px-4 py-3">
			<h2 class="text-xs font-bold tracking-[0.15em] text-black/50 uppercase">All Artists</h2>
			<button
				class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent text-black/30 transition-colors duration-150 hover:text-black/60"
				onclick={onClose}
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Search -->
		<div class="shrink-0 px-4 py-3">
			<div class="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="shrink-0 text-black/30"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					bind:value={searchQuery}
					type="text"
					placeholder="Search..."
					class="w-full border-none bg-transparent font-mono text-base text-black/80 outline-none placeholder:text-black/30"
				/>
				{#if searchQuery}
					<button
						class="shrink-0 cursor-pointer border-none bg-transparent p-0 text-black/30 transition-colors hover:text-black/60"
						onclick={() => (searchQuery = '')}
						aria-label="Clear search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				{/if}
			</div>
			{#if searchQuery}
				<p class="mt-1.5 text-[0.6rem] text-black/30">
					{totalResults} result{totalResults !== 1 ? 's' : ''}
				</p>
			{/if}
		</div>

		<!-- Artist list -->
		<div class="flex-1 overflow-y-auto px-4 pb-4">
			{#each groupedArtists as [country, countryArtists] (country)}
				<div class="mb-4">
					<h3
						class="sticky top-0 z-10 bg-white pt-2 pb-1.5 text-[0.6rem] font-bold tracking-[0.15em] text-black/40 uppercase"
					>
						{country}
					</h3>
					<ul class="space-y-0">
						{#each countryArtists as artist (artist.id)}
							<li>
								<button
									class="min-h-[44px] w-full cursor-pointer border-b border-black/5 bg-transparent py-2.5 text-left font-mono transition-colors duration-150 hover:opacity-60"
									onclick={() => handleSelect(artist)}
								>
									<span class="text-xs tracking-[0.05em] text-pink uppercase">{artist.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			{#if groupedArtists.length === 0}
				<p class="py-8 text-center text-[0.7rem] text-black/30">No artists found</p>
			{/if}
		</div>
	</div>
{/if}
