<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import MobileNav from '$lib/components/ui/MobileNav.svelte';
	import ArtistDrawer from '$lib/components/ui/ArtistDrawer.svelte';
	import { page } from '$app/stores';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	let { children } = $props();

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

	{@render children()}

	<ArtistDrawer />
</QueryClientProvider>
