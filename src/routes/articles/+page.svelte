<script lang="ts">
	import { articles } from '$lib/data/articles';
	import { resolve } from '$app/paths';
</script>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-10 pb-nav-safe">
		<h1 class="mb-2 text-2xl font-bold tracking-[0.2em] uppercase sm:text-3xl">ARTICLES</h1>

		{#each articles as article (article._id)}
			<a
				href={resolve('/articles/[slug]', { slug: article.slug })}
				class="group block border-b border-black/10 py-8 transition-opacity duration-150 first:pt-0"
			>
				<div class="aspect-video w-full border border-black/10 bg-black/5"></div>

				<div class="mt-4 text-[0.6rem] tracking-[0.2em] text-black/50 uppercase">
					{article.category} · {new Date(article.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</div>

				<h2
					class="mt-2 text-lg font-bold uppercase transition-opacity duration-150 group-hover:opacity-70"
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
