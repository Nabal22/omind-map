<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/png" />
	
	<link rel="apple-touch-icon" href={favicon} />
	
	<link rel="manifest" href="/site.webmanifest" />
	
	<meta name="theme-color" content="#ffaef6" />
</svelte:head>
{@render children()}
