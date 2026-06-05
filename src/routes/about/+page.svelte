<script lang="ts">
	import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '$lib/config';
</script>

<svelte:head>
	<title>What is Omind? — {SITE_NAME}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<section class="min-h-dvh px-6 pt-nav-safe pb-nav-safe font-mono sm:px-12">
	<h1 class="text-3xl tracking-[0.1em] text-pink uppercase">What is Omind?</h1>
	<p class="mt-6 max-w-prose text-base text-black/70">{SITE_TAGLINE}.</p>
	<p class="mt-4 max-w-prose text-base text-black/70">{SITE_DESCRIPTION}</p>
</section>
