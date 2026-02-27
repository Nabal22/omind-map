<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { beforeNavigate } from '$app/navigation';
	import { getSelectedArtist, closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import { articles } from '$lib/data/articles';
	import { resolve } from '$app/paths';
	import { createSwipeToDismiss } from '$lib/utils/touch.svelte';

	const loadedIframes = new SvelteSet<string>();

	let artist = $derived(getSelectedArtist());
	let open = $derived(!!artist);

	// Keep a snapshot of the last artist so content stays visible while animating out
	let displayArtist = $state(getSelectedArtist());
	$effect(() => {
		if (artist) displayArtist = artist;
	});

	let relatedArticles = $derived(
		displayArtist ? articles.filter((a) => a.relatedArtistId === displayArtist!.id) : []
	);

	// Clear snapshot after close animation finishes
	let mounted = $state(false);
	$effect(() => {
		if (!open) {
			const timeout = setTimeout(() => {
				displayArtist = null;
				mounted = false;
			}, 200);
			return () => clearTimeout(timeout);
		} else {
			mounted = true;
		}
	});

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}

	beforeNavigate(() => {
		closeArtistDrawer();
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && artist) {
			closeArtistDrawer();
		}
	}

	const swipe = createSwipeToDismiss(closeArtistDrawer);
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mounted || open}
	<!-- Mobile backdrop -->
	<button
		class="fixed inset-0 z-[70] border-none bg-black/30 p-0 transition-opacity duration-150 sm:hidden
			{open ? 'opacity-100' : 'pointer-events-none opacity-0'}"
		onclick={closeArtistDrawer}
		aria-label="Close artist drawer"
	></button>

	<!-- Drawer -->
	<div
		class="fixed inset-x-0 bottom-0 z-[71] touch-manipulation overscroll-contain border-t border-black/10 bg-white font-mono text-black sm:inset-auto sm:top-6 sm:left-6 sm:max-w-sm sm:border sm:border-black/10
			{open ? '' : 'pointer-events-none'}"
		style="transform: translateY({open ? `${swipe.dragY}px` : '100%'}); opacity: {open
			? 1 - swipe.progress * 0.4
			: 0}; transition: {swipe.dragging
			? 'none'
			: 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease'};"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		use:swipe.action
		role="dialog"
		tabindex="-1"
	>
		<!-- Handle bar (mobile only) -->
		<div class="flex justify-center py-2.5 sm:hidden">
			<div class="h-1 w-10 rounded-full bg-black/15"></div>
		</div>

		<!-- Close button -->
		<button
			class="absolute top-2 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent text-black/30 transition-colors duration-150 hover:text-black/60 sm:top-3"
			onclick={closeArtistDrawer}
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
				><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
			>
		</button>

		{#if displayArtist}
			<div
				class="max-h-[70dvh] overflow-y-auto px-4 pb-safe sm:max-h-none sm:pt-4"
				style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 0px))"
			>
				<div class="mb-3 flex items-start gap-3">
					<div class="min-w-0 flex-1">
						<h2 class="text-base font-bold uppercase">
							<a
								href={displayArtist.musicUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-pink no-underline focus-ring transition-opacity duration-150 hover:opacity-60"
							>
								{displayArtist.name}
							</a>
						</h2>
						<p class="mb-2 text-[0.7rem] text-black/50">{displayArtist.country}</p>
						<p class="text-[0.7rem] leading-relaxed text-black/80">
							{displayArtist.description}
						</p>
					</div>
					<img
						src={displayArtist.imageUrl}
						alt={displayArtist.name}
						width="96"
						height="112"
						loading="lazy"
						class="h-28 w-24 shrink-0 object-cover"
						draggable="false"
					/>
				</div>

				{#if displayArtist.soundcloudUrl?.length}
					<div class="mt-4 border-t border-black/10 pt-3">
						<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/50 uppercase">TRACKS</p>
						{#each displayArtist.soundcloudUrl as url (url)}
							<div class="relative mb-1 h-5 py-0.5">
								{#if !loadedIframes.has(url)}
									<div class="absolute inset-0 flex items-center">
										<div class="h-3 w-full animate-pulse rounded-sm bg-black/5"></div>
									</div>
								{/if}
								<iframe
									title="{displayArtist.name} on SoundCloud"
									scrolling="no"
									allow="autoplay"
									width="100%"
									height="20"
									src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaefb&auto_play=false&show_user=false&show_artwork=false`}
									class="transition-opacity duration-300 {loadedIframes.has(url)
										? 'opacity-100'
										: 'opacity-0'}"
									onload={() => handleIframeLoad(url)}
								></iframe>
							</div>
						{/each}
					</div>
				{/if}

				{#if relatedArticles.length}
					<div class="mt-4 border-t border-black/10 pt-3">
						<p class="mb-2 text-[0.6rem] tracking-[0.15em] text-black/50 uppercase">ARTICLES</p>
						{#each relatedArticles as article (article._id)}
							<a
								href={resolve('/articles/[slug]', { slug: article.slug })}
								class="block py-1.5 text-[0.7rem] text-black/80 focus-ring transition-opacity duration-150 hover:text-pink"
							>
								{article.title}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
