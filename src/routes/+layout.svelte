<script lang="ts">
	import './layout.css';
	import { SITE_URL, SITE_NAME } from '$lib/config';
	import MobileNav from '$lib/components/ui/MobileNav.svelte';
	import ArtistDrawer from '$lib/components/ui/ArtistDrawer.svelte';
	import SearchOverlay from '$lib/components/ui/SearchOverlay.svelte';
	import Scene from '$lib/components/globe/Scene.svelte';
	import SceneContent from '$lib/components/globe/SceneContent.svelte';
	import ArtistsList from '$lib/components/ui/ArtistsList.svelte';
	import MobileSheet from '$lib/components/ui/MobileSheet.svelte';
	import { closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { goto, pushState } from '$app/navigation';
	import { onNavigate } from '$app/navigation';
	import { getSelectedArtist } from '$lib/stores/artist-drawer.svelte';
	import { fade } from 'svelte/transition';
	import { isGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import { openSearch, resetSearch } from '$lib/stores/search.svelte';
	import { artists } from '$lib/data/artists';
	import {
		getSelectedCountry,
		getFocusCountry,
		selectCountry,
		setCountryFilter,
		clearSelection,
		resetSelection,
		focusOnArtist
	} from '$lib/stores/explore.svelte';

	let { children } = $props();

	const isExplorePage = $derived(page.url.pathname === '/');
	const isArtistPage = $derived(page.url.pathname.startsWith('/artists/'));
	const showsFullscreenGlobe = $derived(isExplorePage || isArtistPage);
	const globeLoaded = $derived(isGlobeLoaded());
	const drawerArtist = $derived(getSelectedArtist());
	const selectedCountry = $derived(getSelectedCountry());
	const focusCountry = $derived(getFocusCountry());

	function isGlobeContext(pathname: string | undefined): boolean {
		if (!pathname) return false;
		return pathname === '/' || pathname.startsWith('/artists/');
	}

	function navigateToArtist(artistId: string) {
		// In globe context: shallow nav. URL updates to /artists/[id] without
		// unmounting the current page, so the globe stays put and the sheet
		// owns the visual transition.
		if (isGlobeContext(page.url.pathname)) {
			const artist = artists.find((a) => a.id === artistId);
			if (artist) {
				pushState(`/artists/${artistId}`, { shallow: true });
				focusOnArtist(artist);
				return;
			}
		}
		goto(`/artists/${artistId}`);
	}

	function handleCloseArtist() {
		// Shallow nav: pop URL back so / shows again. The pathname-watch $effect
		// closes the drawer once URL changes.
		if (page.state.shallow) {
			history.back();
			return;
		}
		// On real /artists/[id] route, navigating back unmounts the page; its
		// effect cleanup closes the drawer. selectedCountry is preserved.
		if (isArtistPage) goto('/');
		else closeArtistDrawer();
	}

	// Close drawer when URL pops back from a shallow /artists/[id] (browser back
	// button or history.back from handleCloseArtist). Doesn't affect drawers
	// opened without URL change (e.g. from /articles/[slug]).
	let prevIsArtistUrl = false;
	$effect(() => {
		const onArtist = page.url.pathname.startsWith('/artists/');
		if (prevIsArtistUrl && !onArtist && drawerArtist) {
			closeArtistDrawer();
		}
		prevIsArtistUrl = onArtist;
	});

	function handleGlobeCountryClick(name: string) {
		selectCountry(name);
		// If user clicked a country while on /artists/[id], jump back to /
		// so URL is consistent with the new country focus.
		if (isArtistPage) goto('/');
	}

	function handleGlobeBackgroundClick() {
		if (isArtistPage) {
			goto('/');
		} else if (isExplorePage) {
			clearSelection();
		}
	}

	// Reading searchParams during prerender SSR is forbidden — defer to client.
	let showFps = $state(import.meta.env.DEV);
	onMount(() => {
		if (new URLSearchParams(window.location.search).has('fps')) showFps = true;
	});

	function handleMiniGlobeClick() {
		goto('/');
	}

	onNavigate((navigation) => {
		// Force-clear selection when leaving the globe context (/, /artists/*) for an
		// unrelated route. Stays "warm" when navigating between / and /artists/[id].
		const fromGlobe = isGlobeContext(navigation.from?.url.pathname);
		const toGlobe = isGlobeContext(navigation.to?.url.pathname);
		if (fromGlobe && !toGlobe) {
			resetSelection();
		}

		resetSearch();

		// Skip view-transition crossfade for in-context nav (/ ↔ /artists/[id]) —
		// the bottom sheet animates between country list and artist details
		// internally; the browser-level crossfade only adds a flicker.
		if (fromGlobe && toGlobe) return;

		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="canonical" href="{SITE_URL}{page.url.pathname}" />
	<meta property="og:url" content="{SITE_URL}{page.url.pathname}" />
	{#if page.state.shallow && drawerArtist}
		<title>{drawerArtist.name} — {SITE_NAME}</title>
		<meta property="og:title" content={drawerArtist.name} />
		<meta property="og:description" content={drawerArtist.description} />
	{/if}
</svelte:head>

<MobileNav currentPath={page.url.pathname} onSearchClick={openSearch} />
<SearchOverlay />

<!-- Globe scene — always mounted, animates between fullscreen and mini corner -->
<div
	class="fixed touch-manipulation overflow-hidden
			{showsFullscreenGlobe
		? 'z-0 bg-white'
		: 'z-[80] cursor-pointer opacity-80 hover:opacity-100 focus:opacity-100'}"
	style="
			transition: top 200ms cubic-bezier(0.4, 0, 0.2, 1),
				right 200ms cubic-bezier(0.4, 0, 0.2, 1),
				bottom 200ms cubic-bezier(0.4, 0, 0.2, 1),
				left 200ms cubic-bezier(0.4, 0, 0.2, 1),
				border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1),
				transform 200ms ease;
			top: {showsFullscreenGlobe ? '0px' : 'var(--mini-globe-top)'};
			right: {showsFullscreenGlobe ? '0px' : 'var(--mini-globe-right)'};
			bottom: {showsFullscreenGlobe ? '0px' : 'var(--mini-globe-bottom)'};
			left: {showsFullscreenGlobe ? '0px' : 'var(--mini-globe-left)'};
			border-radius: {showsFullscreenGlobe ? '0px' : '9999px'};
		"
	onclick={showsFullscreenGlobe ? undefined : handleMiniGlobeClick}
	onkeydown={showsFullscreenGlobe ? undefined : (e) => e.key === 'Enter' && handleMiniGlobeClick()}
	role="button"
	tabindex="-1"
	aria-label={showsFullscreenGlobe ? 'Globe scene' : 'Back to explore'}
>
	{#if !globeLoaded}
		<div
			class="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
			out:fade={{ duration: 600 }}
		>
			<span class="animate-pulse font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
				Loading…
			</span>
		</div>
	{/if}

	{#if globeLoaded && !selectedCountry && isExplorePage}
		<div
			class="pointer-events-none absolute right-0 bottom-6 left-0 z-30 flex justify-center sm:hidden"
			in:fade={{ duration: 300, delay: 600 }}
		>
			<span class="px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
				Tap a country to explore
			</span>
		</div>
	{/if}

	<!-- Globe canvas (client-only — Three.js needs window) -->
	<div
		class="absolute inset-0"
		onclick={showsFullscreenGlobe ? handleGlobeBackgroundClick : undefined}
		onkeydown={showsFullscreenGlobe
			? (e) => e.key === 'Escape' && handleGlobeBackgroundClick()
			: undefined}
		role="button"
		tabindex="-1"
	>
		{#if browser}
			<Scene>
				<SceneContent
					onCountryClick={handleGlobeCountryClick}
					{selectedCountry}
					{focusCountry}
					isExplorePage={showsFullscreenGlobe}
					showPerf={showFps}
				/>
			</Scene>
		{/if}
	</div>

	<!-- Desktop: Artists list (hidden when artist drawer is open) -->
	{#if showsFullscreenGlobe}
		<div class="hidden {drawerArtist ? '' : 'sm:block'}">
			<div
				in:fade={{ duration: 200, delay: 50 }}
				out:fade={{ duration: 100 }}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') setCountryFilter(null);
				}}
				role="presentation"
			>
				<ArtistsList
					{selectedCountry}
					onArtistSelect={(artist) => navigateToArtist(artist.id)}
					onClose={clearSelection}
				/>
			</div>
		</div>
	{/if}
</div>

<!-- Page content. On / and /artists/[id] the page renders sr-only SEO content
     (invisible to users; crawlable). On other routes it shows normally. -->
<div class="relative z-10">
	{@render children()}
</div>

<!-- Mobile: unified bottom sheet (rendered on every page so artist links from
     /articles/[slug] still pop a sheet on mobile) -->
<MobileSheet
	{selectedCountry}
	selectedArtist={drawerArtist}
	onCloseCountry={clearSelection}
	onCloseArtist={handleCloseArtist}
	onArtistSelect={(artist) => navigateToArtist(artist.id)}
/>

<ArtistDrawer onClose={handleCloseArtist} />
