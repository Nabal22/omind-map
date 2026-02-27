<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import MobileNav from '$lib/components/ui/MobileNav.svelte';
	import ArtistDrawer from '$lib/components/ui/ArtistDrawer.svelte';
	import Scene from '$lib/components/globe/Scene.svelte';
	import SceneContent from '$lib/components/globe/SceneContent.svelte';
	import ArtistsList from '$lib/components/ui/ArtistsList.svelte';
	import MobileCountryPanel from '$lib/components/ui/MobileCountryPanel.svelte';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { getSelectedArtist } from '$lib/stores/artist-drawer.svelte';
	import { fade } from 'svelte/transition';
	import { isGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import {
		getSelectedCountry,
		getFocusCountry,
		selectCountry,
		setCountryFilter,
		selectArtist,
		setFocusCountry,
		clearSelection
	} from '$lib/stores/explore.svelte';

	let { children } = $props();

	const isExplorePage = $derived($page.url.pathname === '/');
	const globeLoaded = $derived(isGlobeLoaded());
	const drawerArtist = $derived(getSelectedArtist());
	const selectedCountry = $derived(getSelectedCountry());
	const focusCountry = $derived(getFocusCountry());

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				gcTime: Infinity
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/png" />

	<link rel="apple-touch-icon" href={favicon} />

	<link rel="manifest" href="/site.webmanifest" />

	<meta name="theme-color" content="#ffffff" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<MobileNav currentPath={$page.url.pathname} />

	<!-- Globe scene — always mounted, visibility toggled by route -->
	<div
		class="fixed inset-0 z-0 overflow-hidden bg-white"
		class:invisible={!isExplorePage}
		class:pointer-events-none={!isExplorePage}
	>
		{#if !globeLoaded}
			<div
				class="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
				out:fade={{ duration: 600 }}
			>
				<span
					class="animate-pulse font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase"
				>
					Loading
				</span>
			</div>
		{/if}

		{#if globeLoaded && !selectedCountry && isExplorePage}
			<div
				class="pointer-events-none absolute right-0 bottom-16 left-0 z-30 flex justify-center sm:hidden"
				in:fade={{ duration: 300 }}
			>
				<span class="px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
					Tap a country to explore
				</span>
			</div>
		{/if}

		<!-- Globe canvas -->
		<div
			class="absolute inset-0"
			onclick={clearSelection}
			onkeydown={(e) => e.key === 'Escape' && clearSelection()}
			role="button"
			tabindex="-1"
		>
			<Scene>
				<SceneContent onCountryClick={selectCountry} {selectedCountry} {focusCountry} />
			</Scene>
		</div>

		<!-- Desktop: Artists list (hidden when artist drawer is open) -->
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
					onArtistSelect={(artist) => {
						selectArtist(artist);
						setFocusCountry(artist.country);
					}}
				/>
			</div>
		</div>

		<!-- Mobile: Country Panel -->
		<div class="sm:hidden">
			<MobileCountryPanel
				{selectedCountry}
				onClose={clearSelection}
				onArtistSelect={(artist) => {
					if (artist) selectArtist(artist);
				}}
			/>
		</div>
	</div>

	<!-- Page content — sits above globe layer, hidden on explore page -->
	<div class="relative z-10" class:hidden={isExplorePage}>
		{@render children()}
	</div>

	<ArtistDrawer />
</QueryClientProvider>
