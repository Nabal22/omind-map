<script lang="ts">
	import { artists, type Artist } from '$lib/data/artists';
	import { SITE_NAME, SITE_URL, OG_IMAGE } from '$lib/config';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	let { data } = $props();

	let article = $derived(data.article);
	let relatedArtist = $derived(artists.find((a) => a.id === article.relatedArtistId));

	function handleArtistClick(e: MouseEvent, artist: Artist) {
		// Let modifier-clicks (cmd, ctrl, shift, middle) follow href to /artists/[id].
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
		e.preventDefault();
		openArtistDrawer(artist);
	}

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const articleJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description: article.excerpt,
		datePublished: article.publishedAt,
		author: { '@type': 'Person', name: article.author },
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}${OG_IMAGE}` }
		},
		mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
		image: `${SITE_URL}${OG_IMAGE}`
	});

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
			{ '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
			{
				'@type': 'ListItem',
				position: 3,
				name: article.title,
				item: `${SITE_URL}/articles/${article.slug}`
			}
		]
	});
</script>

<svelte:head>
	<title>{article.title} — {SITE_NAME}</title>
	<meta name="description" content={article.excerpt} />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={article.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:image" content="{SITE_URL}{OG_IMAGE}" />
	<meta property="article:published_time" content={article.publishedAt} />
	<meta property="article:author" content={article.author} />
</svelte:head>

<JsonLd data={articleJsonLd} />
<JsonLd data={breadcrumbJsonLd} />

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-xl px-6 pt-10 pb-nav-safe">
		<nav
			class="mb-8 flex min-w-0 items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase"
			aria-label="Breadcrumb"
		>
			<a
				href="/articles"
				class="shrink-0 text-black/50 focus-ring transition-opacity duration-150 hover:text-pink"
			>
				ARTICLES
			</a>
			<span class="text-black/20">/</span>
			<span class="min-w-0 truncate text-black">{article.title}</span>
		</nav>

		<div>
			<div class="text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">
				{article.category} · {dateFormatter.format(new Date(article.publishedAt))} · {article.author}
			</div>

			<h1 class="mt-4 text-2xl font-medium text-pretty sm:text-3xl">
				{article.title}
			</h1>

			<div class="mt-8 aspect-video w-full border border-black/10 bg-black/5"></div>

			<div class="mt-10 space-y-6">
				{#each article.body as block, i (i)}
					{#if block._type === 'paragraph'}
						<p class="text-[0.8rem] leading-[1.8] text-black">
							{block.text}
						</p>
					{:else if block._type === 'heading'}
						<h2 class="text-base font-bold text-pretty uppercase">
							{block.text}
						</h2>
					{:else if block._type === 'quote'}
						<blockquote
							class="border-l-2 border-pink/20 pl-4 text-[0.8rem] leading-[1.8] text-black/70 italic"
						>
							{block.text}
						</blockquote>
					{/if}
				{/each}
			</div>

			{#if relatedArtist}
				<div class="mt-16 border-t border-black/10 pt-8">
					<div class="text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">RELATED ARTIST</div>
					<a
						href="/artists/{relatedArtist.id}"
						data-sveltekit-preload-data="off"
						onclick={(e) => handleArtistClick(e, relatedArtist!)}
						class="mt-2 inline-block font-mono text-sm text-pink uppercase no-underline focus-ring transition-opacity duration-150 hover:opacity-70"
					>
						{relatedArtist.name}
					</a>
				</div>
			{/if}

			<div class="mt-16">
				<a
					href="/articles"
					class="text-[0.65rem] tracking-[0.15em] text-black/50 uppercase focus-ring transition-opacity duration-150 hover:text-pink"
				>
					ALL ARTICLES
				</a>
			</div>
		</div>
	</div>
</div>
