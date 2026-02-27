<script lang="ts">
	let { data } = $props();
	let playlist = $derived(data.playlist);
</script>

<div class="h-dvh w-screen overflow-y-auto bg-white font-mono text-black">
	<div class="mx-auto max-w-xl px-6 pt-10 pb-nav-safe">
		<nav
			class="mb-8 flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase"
			aria-label="Breadcrumb"
		>
			<a href="/playlists" class="text-black/40 transition-colors duration-150 hover:text-pink">
				PLAYLISTS
			</a>
			<span class="text-black/20">/</span>
			<span class="truncate text-black/70">{playlist.title}</span>
		</nav>

		<div>
			<div class="text-[0.6rem] tracking-[0.2em] text-black/30 uppercase">
				{playlist.tracks.length} tracks · {new Date(playlist.createdAt).toLocaleDateString(
					'en-US',
					{
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					}
				)} · {playlist.curator}
			</div>

			<h1 class="mt-4 text-2xl font-medium tracking-wide sm:text-3xl">
				{playlist.title}
			</h1>

			<p class="mt-4 text-[0.8rem] leading-relaxed text-black/50">
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

			{#if playlist.streamingLinks}
				<div class="mt-6 flex flex-wrap gap-3">
					{#if playlist.streamingLinks.spotify}
						<a
							href={playlist.streamingLinks.spotify}
							target="_blank"
							rel="noopener noreferrer"
							class="border border-black/10 px-3 py-1.5 text-[0.65rem] tracking-[0.15em] text-black/40 uppercase transition-colors duration-150 hover:border-pink hover:text-pink"
						>
							Spotify
						</a>
					{/if}
					{#if playlist.streamingLinks.appleMusic}
						<a
							href={playlist.streamingLinks.appleMusic}
							target="_blank"
							rel="noopener noreferrer"
							class="border border-black/10 px-3 py-1.5 text-[0.65rem] tracking-[0.15em] text-black/40 uppercase transition-colors duration-150 hover:border-pink hover:text-pink"
						>
							Apple Music
						</a>
					{/if}
					{#if playlist.streamingLinks.soundcloud}
						<a
							href={playlist.streamingLinks.soundcloud}
							target="_blank"
							rel="noopener noreferrer"
							class="border border-black/10 px-3 py-1.5 text-[0.65rem] tracking-[0.15em] text-black/40 uppercase transition-colors duration-150 hover:border-pink hover:text-pink"
						>
							SoundCloud
						</a>
					{/if}
				</div>
			{/if}

			<div class="mt-10 border-t border-black/10">
				{#each playlist.tracks as track, i (track.title)}
					<div class="flex items-baseline gap-4 border-b border-black/5 py-3">
						<span class="w-5 shrink-0 text-right text-[0.6rem] text-black/20">{i + 1}</span>
						<div class="min-w-0 flex-1">
							<span class="text-[0.8rem] tracking-[0.05em] text-black/80 uppercase"
								>{track.title}</span
							>
							<span class="ml-2 text-[0.7rem] text-black/30">{track.artist}</span>
						</div>
						<span class="shrink-0 text-[0.65rem] text-black/25 tabular-nums">{track.duration}</span>
					</div>
				{/each}
			</div>

			<div class="mt-12">
				<a
					href="/playlists"
					class="text-[0.65rem] tracking-[0.15em] text-black/40 uppercase transition-colors duration-150 hover:text-pink"
				>
					ALL PLAYLISTS
				</a>
			</div>
		</div>
	</div>
</div>
