<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import MobileNav from '$lib/components/ui/MobileNav.svelte';
	import ArtistDrawer from '$lib/components/ui/ArtistDrawer.svelte';
	import ArtistBrowser from '$lib/components/ui/ArtistBrowser.svelte';
	import Scene from '$lib/components/globe/Scene.svelte';
	import SceneContent from '$lib/components/globe/SceneContent.svelte';
	import ArtistsList from '$lib/components/ui/ArtistsList.svelte';
	import MobileSheet from '$lib/components/ui/MobileSheet.svelte';
	import { closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onNavigate } from '$app/navigation';
	import { getSelectedArtist } from '$lib/stores/artist-drawer.svelte';
	import { fade } from 'svelte/transition';
	import { isGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import { haptic } from '$lib/utils/haptics';
	import {
		getSelectedCountry,
		getFocusCountry,
		selectCountry,
		setCountryFilter,
		clearSelection,
		resetSelection
	} from '$lib/stores/explore.svelte';

	let { children } = $props();

	const isExplorePage = $derived($page.url.pathname === '/');
	const isArtistPage = $derived($page.url.pathname.startsWith('/artists/'));
	const showsFullscreenGlobe = $derived(isExplorePage || isArtistPage);
	let browserOpen = $state(false);
	const globeLoaded = $derived(isGlobeLoaded());
	const drawerArtist = $derived(getSelectedArtist());
	const selectedCountry = $derived(getSelectedCountry());
	const focusCountry = $derived(getFocusCountry());

	function isGlobeContext(pathname: string | undefined): boolean {
		if (!pathname) return false;
		return pathname === '/' || pathname.startsWith('/artists/');
	}

	function navigateToArtist(artistId: string) {
		goto(`/artists/${artistId}`);
	}

	function handleCloseArtist() {
		// On artist URL, "close" means navigate back to /. The page's effect cleanup
		// handles closeArtistDrawer; selectedCountry is preserved so the country list
		// reappears at /.
		if (isArtistPage) goto('/');
		else closeArtistDrawer();
	}

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
	<link rel="icon" href={favicon} type="image/png" />

	<link rel="apple-touch-icon" href={favicon} />

	<link rel="manifest" href="/site.webmanifest" />

	<meta name="theme-color" content="#ffffff" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</svelte:head>

<MobileNav currentPath={$page.url.pathname} {isExplorePage} />

<!-- Globe scene — always mounted, animates between fullscreen and mini corner -->
<div
	class="fixed touch-manipulation overflow-hidden
			{showsFullscreenGlobe
		? 'z-0 bg-white'
		: 'z-20 cursor-pointer opacity-70 hover:opacity-100 focus:opacity-100'}"
	style="
			transition: top 200ms cubic-bezier(0.4, 0, 0.2, 1),
				right 200ms cubic-bezier(0.4, 0, 0.2, 1),
				bottom 200ms cubic-bezier(0.4, 0, 0.2, 1),
				left 200ms cubic-bezier(0.4, 0, 0.2, 1),
				border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1),
				transform 200ms ease;
			top: {showsFullscreenGlobe ? '0px' : '1rem'};
			right: {showsFullscreenGlobe ? '0px' : 'var(--mini-globe-right)'};
			bottom: {showsFullscreenGlobe ? '0px' : 'calc(100dvh - 1rem - 5rem)'};
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
			class="pointer-events-none absolute right-0 bottom-16 left-0 z-30 flex justify-center sm:hidden"
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

<!-- Page content. On / the page is empty (globe is rendered above). On
     /artists/[id] the page renders sr-only SEO content (invisible). On other
     routes (/articles, /playlists) it shows normally. -->
<div class="relative z-10" class:hidden={isExplorePage}>
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

<!-- Browse all artists button (explore page only, hidden when country selected) -->
{#if isExplorePage}
	{#if !selectedCountry}
		<button
			class="fixed bottom-20 left-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/90 text-black/50 shadow-sm backdrop-blur-sm transition-all duration-150 hover:text-pink sm:bottom-6"
			onclick={() => {
				haptic('light');
				browserOpen = true;
			}}
			aria-label="Browse all artists"
			transition:fade={{ duration: 150 }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
		</button>
	{/if}

	<ArtistBrowser
		open={browserOpen}
		onClose={() => (browserOpen = false)}
		onArtistSelect={(artist) => navigateToArtist(artist.id)}
	/>
{/if}
