<script lang="ts">
	import type { Artist } from '$lib/data/artists';

	interface Props {
		countryName: string;
		artists: Artist[];
		onArtistClick: (artist: Artist) => void;
		onClose: () => void;
	}

	let { countryName, artists, onArtistClick, onClose }: Props = $props();
</script>

<div
	class="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 sm:items-center sm:p-6"
>
	<div
		class="animate-slide-up pointer-events-auto relative w-full max-w-xs border-2 border-pink bg-black/95 p-4 font-mono text-pink shadow-[0_0_30px_rgba(255,174,246,0.2)]"
	>
		<button
			class="absolute top-3 right-3 z-10 cursor-pointer bg-transparent p-1 font-mono text-sm text-pink transition-all hover:[text-shadow:0_0_8px_#ffaef6]"
			onclick={onClose}
		>
			[X]
		</button>

		<p class="mb-1 text-[0.6rem] tracking-[0.25em] uppercase opacity-50">WHO THE FUCK IS FROM</p>
		<h2 class="mb-4 text-xl font-bold tracking-wide uppercase [text-shadow:0_0_10px_#ffaef6]">
			{countryName}
		</h2>

		<div class="space-y-2">
			{#each artists as artist (artist.id)}
				<button
					class="group flex w-full cursor-pointer items-center gap-3 border border-pink/40 bg-transparent p-3 text-left font-mono text-pink transition-all hover:border-pink hover:bg-pink/10"
					onclick={() => onArtistClick(artist)}
				>
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center border border-pink/60 text-[0.6rem] transition-all group-hover:bg-pink group-hover:text-black"
					>
						►
					</span>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-bold uppercase">{artist.name}</p>
						<p class="truncate text-[0.65rem] opacity-60">{artist.description}</p>
					</div>
				</button>
			{/each}
		</div>

		<div class="mt-4 border-t border-pink/20 pt-3">
			<p class="text-[0.55rem] tracking-[0.2em] uppercase opacity-40">
				{artists.length} ARTIST{artists.length > 1 ? 'S' : ''} FOUND
			</p>
		</div>
	</div>
</div>
