<script lang="ts">
	import { fly } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Artist } from '$lib/data/artists';

	interface Props {
		artist: Artist;
		onBack: () => void;
	}

	let { artist, onBack }: Props = $props();

	// Cache for loaded iframes
	const loadedIframes = new SvelteSet<string>();

	function handleIframeLoad(url: string) {
		loadedIframes.add(url);
	}
</script>

<div
	class="fixed inset-x-4 bottom-4 z-50 border border-pink/10 bg-black p-4 font-mono text-pink sm:inset-auto sm:left-6 sm:top-6 sm:max-w-sm"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.key === 'Escape' && onBack()}
	role="dialog"
	tabindex="-1"
>
	<div in:fly={{ x: -10, duration: 150 }}>
		<button
			class="mb-3 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-pink/40 transition-opacity duration-150 hover:text-pink"
			onclick={onBack}
		>
			BACK
		</button>
	</div>

	<h2 class="mb-3 text-base font-normal uppercase tracking-[0.1em]" in:fly={{ x: -10, duration: 150, delay: 50 }}>
		<a
			href={artist.musicUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-pink no-underline transition-opacity duration-150 hover:opacity-60"
		>
			{artist.name}
		</a>
	</h2>

	<div class="space-y-1 text-[0.7rem] leading-relaxed" in:fly={{ x: -10, duration: 150, delay: 100 }}>
		<p><span class="text-pink/30">{artist.country}</span></p>
		<p class="text-pink/60">{artist.description}</p>
	</div>

	{#if artist.soundcloudUrl?.length}
		<div class="mt-4 border-t border-pink/10 pt-3" in:fly={{ x: -10, duration: 150, delay: 150 }}>
			<p class="mb-2 text-[0.6rem] uppercase tracking-[0.15em] text-pink/30">TRACKS</p>
			{#each artist.soundcloudUrl as url (url)}
				<div class="relative min-h-5 py-0.5">
					{#if !loadedIframes.has(url)}
						<span class="text-[0.6rem] tracking-[0.1em] text-pink/20">LOADING</span>
					{/if}
					<iframe
						title="{artist.name} on SoundCloud"
						scrolling="no"
						allow="autoplay"
						width="100%"
						height="20"
						src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffffff&auto_play=false&show_user=false&show_artwork=false`}
						class="transition-opacity duration-200 {loadedIframes.has(url)
							? 'opacity-100'
							: 'opacity-0'}"
						onload={() => handleIframeLoad(url)}
					></iframe>
				</div>
			{/each}
		</div>
	{/if}
</div>
