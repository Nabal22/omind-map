<script lang="ts">
	import type { Artist } from '$lib/data/artists';

	interface Props {
		artist: Artist;
		onclose: () => void;
	}

	let { artist, onclose }: Props = $props();
</script>

<div
	class="fixed inset-0 flex items-end justify-center z-100 pointer-events-none pb-14
		sm:items-center sm:p-4 sm:pb-4"
	role="dialog"
	aria-modal="true"
>
	<div
		class="pointer-events-auto bg-black border-0 border-t-2 border-pink p-6 w-full font-mono text-pink relative
			animate-slide-up shadow-[0_0_20px_rgba(255,174,246,0.3),inset_0_0_20px_rgba(255,174,246,0.05)]
			sm:border-2 sm:p-8 sm:max-w-100 sm:animate-glitch-in
			sm:before:content-[''] sm:before:absolute sm:before:-inset-1 sm:before:border sm:before:border-pink sm:before:opacity-40 sm:before:pointer-events-none"
	>
		<button
			class="absolute top-4 right-4 bg-transparent border-none text-pink font-mono text-base cursor-pointer p-2 z-10
				hover:[text-shadow:0_0_8px_#ffaef6]"
			onclick={onclose}
		>
			[X]
		</button>
		<p class="text-[0.7rem] tracking-[0.2em] mb-1 opacity-70">WHERE THE FUCK IS</p>
		<h2
			class="text-[1.4rem] mb-4 uppercase [text-shadow:0_0_10px_#ffaef6]
				sm:text-[1.8rem] sm:mb-6"
		>
			{artist.name}
		</h2>
		<div class="mb-6 space-y-2 text-[0.8rem] leading-snug sm:text-[0.85rem]">
			<p><span class="opacity-60">COUNTRY:</span> {artist.country}</p>
			<p><span class="opacity-60">BIO:</span> {artist.description}</p>
		</div>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
		<a
			class="inline-block text-pink no-underline text-[0.9rem] border border-pink py-2 px-4 transition-all duration-200
				hover:bg-pink hover:text-black hover:shadow-[0_0_15px_#ffaef6]"
			href={artist.musicUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			[ LISTEN → ]
		</a>
	</div>
</div>
