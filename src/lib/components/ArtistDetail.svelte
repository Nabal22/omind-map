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
	class="fixed inset-x-4 bottom-4 z-50 rounded-xl bg-black/90 p-4 font-mono text-pink backdrop-blur-sm sm:inset-auto sm:left-6 sm:top-6 sm:max-w-sm sm:border-pink/20 sm:bg-black/80"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.key === 'Escape' && onBack()}
	role="dialog"
	tabindex="-1"
>
	<div in:fly={{ x: -10, duration: 150 }}>
		<button
			class="mb-3 cursor-pointer border-none bg-transparent p-0 font-mono text-[0.7rem] text-pink opacity-70 transition-all hover:opacity-100 hover:[text-shadow:0_0_8px_#ffaef6]"
			onclick={onBack}
		>
			[BACK]
		</button>
	</div>

	<h2 class="mb-3 text-lg font-bold uppercase" in:fly={{ x: -10, duration: 200, delay: 50 }}>
		<a
			href={artist.musicUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-pink no-underline transition-all duration-200 [text-shadow:0_0_10px_#ffaef6] hover:[text-shadow:0_0_15px_#ffaef6]"
		>
			{artist.name}
		</a>
	</h2>

	<div class="space-y-1 text-[0.75rem] leading-snug" in:fly={{ x: -10, duration: 200, delay: 100 }}>
		<p><span class="opacity-50">COUNTRY:</span> {artist.country}</p>
		<p><span class="opacity-50">BIO:</span> {artist.description}</p>
	</div>

	{#if artist.soundcloudUrl?.length}
		<div class="mt-3" in:fly={{ x: -10, duration: 200, delay: 150 }}>
			<p class="mb-1 text-[0.7rem]"><span class="opacity-50">TOP3:</span></p>
			{#each artist.soundcloudUrl as url (url)}
				<div class="relative min-h-5 py-0.5">
					{#if !loadedIframes.has(url)}
						<div class="glitch-loader absolute inset-0 flex items-center">
							<span class="glitch-text text-[0.6rem] tracking-[0.15em] opacity-70">LOADING_</span>
						</div>
					{/if}
					<iframe
						title="{artist.name} on SoundCloud"
						scrolling="no"
						allow="autoplay"
						width="100%"
						height="20"
						src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaef6&auto_play=false&show_user=false&show_artwork=false`}
						class="transition-opacity duration-300 {loadedIframes.has(url)
							? 'opacity-100'
							: 'opacity-0'}"
						onload={() => handleIframeLoad(url)}
					></iframe>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.glitch-loader {
		animation: flicker 0.15s infinite;
	}

	.glitch-text {
		position: relative;
		color: #ffaef6;
		animation: glitch-skew 1s infinite linear alternate-reverse;
	}

	.glitch-text::before,
	.glitch-text::after {
		content: 'LOADING_';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.glitch-text::before {
		color: #0ff;
		animation: glitch-anim 0.3s infinite linear alternate-reverse;
		clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
	}

	.glitch-text::after {
		color: #f0f;
		animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
		clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
	}

	@keyframes flicker {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
		75% {
			opacity: 0.9;
		}
	}

	@keyframes glitch-anim {
		0% {
			transform: translate(0);
		}
		20% {
			transform: translate(-2px, 1px);
		}
		40% {
			transform: translate(-2px, -1px);
		}
		60% {
			transform: translate(2px, 1px);
		}
		80% {
			transform: translate(2px, -1px);
		}
		100% {
			transform: translate(0);
		}
	}

	@keyframes glitch-anim-2 {
		0% {
			transform: translate(0);
		}
		20% {
			transform: translate(2px, -1px);
		}
		40% {
			transform: translate(2px, 1px);
		}
		60% {
			transform: translate(-2px, -1px);
		}
		80% {
			transform: translate(-2px, 1px);
		}
		100% {
			transform: translate(0);
		}
	}

	@keyframes glitch-skew {
		0% {
			transform: skew(0deg);
		}
		20% {
			transform: skew(-1deg);
		}
		40% {
			transform: skew(1deg);
		}
		60% {
			transform: skew(0deg);
		}
		80% {
			transform: skew(-1deg);
		}
		100% {
			transform: skew(0deg);
		}
	}
</style>
