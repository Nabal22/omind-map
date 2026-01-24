<script lang="ts">
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		onselect: (artist: Artist) => void;
	}

	let { onselect }: Props = $props();
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-50 font-mono px-4 py-3 bg-black/85 backdrop-blur-sm border-t border-pink/20
		sm:top-6 sm:left-6 sm:right-auto sm:bottom-auto sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-t-0"
> 
	<h2
		class="hidden sm:block text-[0.65rem] tracking-[0.2em] text-pink opacity-70 mb-3 uppercase"
	>
		WHERE THE FUCK IS :
	</h2>
	<ul
		class="flex flex-row gap-0 overflow-x-auto [scrollbar-width:none]
			sm:flex-col sm:gap-[0.2rem] sm:overflow-x-visible"
	>
		{#each artists as artist (artist.id)}
			<li>
				<button
					class="bg-transparent border-none text-pink font-mono text-[0.75rem] uppercase cursor-pointer
						py-[0.4rem] px-3 text-left transition-all duration-150
						border-b-2 border-b-transparent whitespace-nowrap
						hover:border-b-pink
						sm:text-[0.85rem] sm:py-[0.3rem] sm:px-2 sm:border-b-0
						sm:border-l-2 sm:border-l-transparent
						sm:hover:border-l-pink sm:hover:border-b-0 sm:hover:pl-4 sm:hover:[text-shadow:0_0_8px_#ffaef6]"
					onclick={() => onselect(artist)}
				>
					{artist.name}
				</button>
			</li>
		{/each}
	</ul>
</nav>
