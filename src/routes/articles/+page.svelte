<script lang="ts">
	import { articles } from '$lib/data/articles';
	import { resolve } from '$app/paths';
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const description =
		'Features, interviews, and reviews on underground rap and experimental artists.';

	const itemListJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Articles',
		itemListElement: articles.map((a, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: `${SITE_URL}/articles/${a.slug}`,
			name: a.title
		}))
	};
</script>

<svelte:head>
	<title>Articles — {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Articles — {SITE_NAME}" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
</svelte:head>

<JsonLd data={itemListJsonLd} />

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-8 pb-nav-safe">
		<h1 class="text-2xl font-bold tracking-[0.2em] text-pretty uppercase sm:text-3xl">ARTICLES</h1>

		{#each articles as article (article._id)}
			<a
				href={resolve('/articles/[slug]', { slug: article.slug })}
				class="group block border-b border-black/10 py-8 focus-ring transition-opacity duration-150 first:pt-0"
			>
				<div class="aspect-video w-full border border-black/10 bg-black/5"></div>

				<div class="mt-4 text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">
					{article.category} · {dateFormatter.format(new Date(article.publishedAt))}
				</div>

				<h2
					class="mt-2 text-lg font-bold text-pretty uppercase transition-opacity duration-150 group-hover:opacity-70"
				>
					{article.title}
				</h2>

				<p class="mt-2 text-[0.75rem] leading-relaxed text-black/80">
					{article.excerpt}
				</p>
			</a>
		{/each}
	</div>
</div>
