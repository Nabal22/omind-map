<script lang="ts">
	import { fly } from 'svelte/transition';
	import { articles } from '$lib/data/articles';
</script>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 py-20">
		<h1
			class="mb-2 text-3xl font-bold tracking-[0.2em] uppercase"
			in:fly={{ y: -15, duration: 300 }}
		>
			ARTICLES
		</h1>

		{#each articles as article, i (article._id)}
			<a
				href="/articles/{article.slug}"
				class="group block border-b border-black/10 py-8 transition-opacity duration-150 first:pt-0"
				in:fly={{ y: 15, duration: 300, delay: i * 80 }}
			>
				<div class="aspect-video w-full border border-black/10 bg-black/5"></div>

				<div class="mt-4 text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
					{article.category} · {new Date(article.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</div>

				<h2
					class="mt-2 text-lg font-bold tracking-[0.1em] uppercase transition-opacity duration-150 group-hover:opacity-70"
				>
					{article.title}
				</h2>

				<p class="mt-2 text-[0.75rem] leading-relaxed text-black/50">
					{article.excerpt}
				</p>
			</a>
		{/each}
	</div>
</div>
