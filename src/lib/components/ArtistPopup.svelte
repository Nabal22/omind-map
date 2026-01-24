<script lang="ts">
	import type { Artist } from '$lib/data/artists';

	interface Props {
		artist: Artist;
		onclose: () => void;
	}

	let { artist, onclose }: Props = $props();
	
	let loadedIframes = $state<Set<string>>(new Set());
	
	function handleIframeLoad(url: string) {
		loadedIframes = new Set([...loadedIframes, url]);
	}
</script>

<div
	class="pointer-events-none fixed inset-0 z-100 flex items-end justify-center pb-14
		sm:items-center sm:p-4 sm:pb-4"
	role="dialog"
	aria-modal="true"
>
	<div
		class="pointer-events-auto relative w-full animate-slide-up border-0 border-t-2 border-pink bg-black p-6 font-mono
			text-pink shadow-[0_0_20px_rgba(255,174,246,0.3),inset_0_0_20px_rgba(255,174,246,0.05)]
			sm:max-w-100 sm:animate-glitch-in sm:border-2 sm:p-8
			sm:before:pointer-events-none sm:before:absolute sm:before:-inset-1 sm:before:border sm:before:border-pink sm:before:opacity-40 sm:before:content-['']"
	>
		<button
			class="absolute top-4 right-4 z-10 cursor-pointer border-none bg-transparent p-2 font-mono text-base text-pink
				hover:[text-shadow:0_0_8px_#ffaef6]"
			onclick={onclose}
		>
			[X]
		</button>
		<p class="mb-1 text-[0.7rem] tracking-[0.2em] opacity-70">WHERE THE FUCK IS</p>
		<h2
			class="mb-4 text-[1.4rem] uppercase [text-shadow:0_0_10px_#ffaef6]
				sm:mb-6 sm:text-[1.8rem]"
		>
			{artist.name}
		</h2>
		<div class="space-y-2 text-[0.8rem] leading-snug sm:text-[0.85rem]">
			<p><span class="opacity-60">COUNTRY:</span> {artist.country}</p>
			<p><span class="opacity-60">BIO:</span> {artist.description}</p>
		</div>
		<div class="mb-2 py-2">
			<p><span class="opacity-60">TOP3:</span></p>
			{#each artist.soundcloudUrl ?? [] as url}
				<div class="py-1 bg-black relative min-h-5">
					{#if !loadedIframes.has(url)}
						<div class="glitch-loader absolute inset-0 flex items-center">
							<span class="glitch-text text-[0.65rem] tracking-[0.15em] opacity-70">LOADING_</span>
						</div>
					{/if}
					<iframe
						title="{artist.name} on SoundCloud"
						scrolling="no"
						allow="autoplay"
						width="100%"
						height="20"
						src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffaef6&auto_play=false&show_user=false&show_artwork=false`}
						class="transition-opacity duration-300 {loadedIframes.has(url) ? 'opacity-100' : 'opacity-0'}"
						onload={() => handleIframeLoad(url)}
					></iframe>
				</div>
			{/each}
		</div>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
		<a
			class="inline-block border border-pink px-4 py-2 text-[0.9rem] text-pink no-underline transition-all duration-200
				hover:bg-pink hover:text-black hover:shadow-[0_0_15px_#ffaef6]"
			href={artist.musicUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			[ LISTEN → ]
		</a>
	</div>
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
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
		75% { opacity: 0.9; }
	}
	
	@keyframes glitch-anim {
		0% { transform: translate(0); }
		20% { transform: translate(-2px, 1px); }
		40% { transform: translate(-2px, -1px); }
		60% { transform: translate(2px, 1px); }
		80% { transform: translate(2px, -1px); }
		100% { transform: translate(0); }
	}
	
	@keyframes glitch-anim-2 {
		0% { transform: translate(0); }
		20% { transform: translate(2px, -1px); }
		40% { transform: translate(2px, 1px); }
		60% { transform: translate(-2px, -1px); }
		80% { transform: translate(-2px, 1px); }
		100% { transform: translate(0); }
	}
	
	@keyframes glitch-skew {
		0% { transform: skew(0deg); }
		20% { transform: skew(-1deg); }
		40% { transform: skew(1deg); }
		60% { transform: skew(0deg); }
		80% { transform: skew(-1deg); }
		100% { transform: skew(0deg); }
	}
</style>