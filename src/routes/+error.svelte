<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Belt-and-suspenders: if SvelteKit ever lands on the error page (e.g. an
	// uncaught load failure), bounce the user back to home instead of showing
	// a dead-end 404 screen.
	onMount(() => {
		goto('/', { replaceState: true });
	});
</script>

<div class="flex min-h-dvh items-center justify-center bg-white font-mono text-black/40">
	<span class="text-[0.65rem] tracking-[0.2em] uppercase">Redirecting…</span>
</div>
