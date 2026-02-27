<script lang="ts">
	import { artists } from '$lib/data/artists';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	let { data } = $props();

	let article = $derived(data.article);
	let relatedArtist = $derived(artists.find((a) => a.id === article.relatedArtistId));

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

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
					<button
						class="mt-2 cursor-pointer border-none bg-transparent p-0 font-mono text-sm text-pink uppercase focus-ring transition-opacity duration-150 hover:opacity-70"
						onclick={() => openArtistDrawer(relatedArtist)}
					>
						{relatedArtist.name}
					</button>
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
