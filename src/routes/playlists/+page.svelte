<script lang="ts">
	import { playlists } from '$lib/data/playlists';
</script>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-2xl px-6 pt-10 pb-nav-safe">
		<h1 class="mb-2 text-2xl font-bold tracking-[0.2em] uppercase sm:text-3xl">PLAYLISTS</h1>

		{#each playlists as playlist (playlist.id)}
			<a
				href="/playlists/{playlist.slug}"
				class="group block border-b border-black/10 py-8 transition-opacity duration-150 first:pt-0"
			>
				<div
					class="mt-4 flex items-center gap-3 text-[0.6rem] tracking-[0.2em] text-black/30 uppercase"
				>
					<span>{playlist.tracks.length} tracks</span>
					<span>·</span>
					<span
						>{new Date(playlist.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}</span
					>
					<span>·</span>
					<span>{playlist.curator}</span>
				</div>

				<h2
					class="mt-2 text-lg font-bold uppercase transition-opacity duration-150 group-hover:opacity-70"
				>
					{playlist.title}
				</h2>

				<p class="mt-2 text-[0.75rem] leading-relaxed text-black/50">
					{playlist.description}
				</p>

				<div class="mt-4 flex flex-wrap gap-2">
					{#each playlist.tags as tag (tag)}
						<span
							class="border border-black/10 px-2 py-0.5 text-[0.6rem] tracking-[0.15em] text-black/30 uppercase"
						>
							{tag}
						</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>
