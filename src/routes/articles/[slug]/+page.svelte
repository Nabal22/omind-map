<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists } from '$lib/data/artists';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	let { data } = $props();

	let article = $derived(data.article);
	let relatedArtist = $derived(artists.find((a) => a.id === article.relatedArtistId));
</script>

<div class="h-dvh w-screen overflow-y-auto bg-black font-mono text-pink">
	<div class="mx-auto max-w-xl px-6 py-20">
		<nav
			class="mb-8 flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase"
			in:fly={{ y: -10, duration: 300 }}
			aria-label="Breadcrumb"
		>
			<a
				href="/articles"
				class="text-pink/40 transition-opacity duration-150 hover:text-pink"
			>
				ARTICLES
			</a>
			<span class="text-pink/20">/</span>
			<span class="truncate text-pink/70">{article.title}</span>
		</nav>

		<div in:fly={{ y: 15, duration: 300, delay: 80 }}>
			<div class="text-[0.6rem] tracking-[0.2em] text-pink/30 uppercase">
				{article.category} · {new Date(article.publishedAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})} · {article.author}
			</div>

			<h1 class="mt-4 text-2xl font-normal tracking-[0.15em] uppercase sm:text-3xl">
				{article.title}
			</h1>

			<div class="mt-8 aspect-video w-full border border-pink/10 bg-pink/5"></div>

			<div class="mt-10 space-y-6">
				{#each article.body as block, i (i)}
					{#if block._type === 'paragraph'}
						<p class="text-[0.8rem] leading-[1.8] text-pink/70">
							{block.text}
						</p>
					{:else if block._type === 'heading'}
						<h2 class="text-base font-normal tracking-[0.1em] uppercase">
							{block.text}
						</h2>
					{:else if block._type === 'quote'}
						<blockquote
							class="border-l-2 border-pink/20 pl-4 text-[0.8rem] leading-[1.8] text-pink/50 italic"
						>
							{block.text}
						</blockquote>
					{/if}
				{/each}
			</div>

			{#if relatedArtist}
				<div class="mt-16 border-t border-pink/10 pt-8">
					<div class="text-[0.6rem] tracking-[0.2em] text-pink/30 uppercase">RELATED ARTIST</div>
					<button
						class="mt-2 cursor-pointer border-none bg-transparent p-0 font-mono text-sm tracking-[0.1em] text-pink uppercase transition-opacity duration-150 hover:opacity-70"
						onclick={() => openArtistDrawer(relatedArtist)}
					>
						{relatedArtist.name}
					</button>
				</div>
			{/if}

			<div class="mt-16">
				<a
					href="/articles"
					class="text-[0.65rem] tracking-[0.15em] text-pink/40 uppercase transition-opacity duration-150 hover:text-pink"
				>
					ALL ARTICLES
				</a>
			</div>
		</div>
	</div>
</div>
