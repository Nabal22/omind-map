<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import MobileNav from '$lib/components/MobileNav.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/png" />

	<link rel="apple-touch-icon" href={favicon} />

	<link rel="manifest" href="/site.webmanifest" />

	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<MobileNav currentPath={$page.url.pathname} />

{@render children()}
