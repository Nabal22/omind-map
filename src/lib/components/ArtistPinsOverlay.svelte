<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists } from '$lib/data/artists';
	import { getAnchorPos, getPinScreenPositions } from '$lib/stores/globe-overlay.svelte';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	interface Props {
		selectedCountry: string | null;
	}

	let { selectedCountry }: Props = $props();

	const anchorPos = $derived(getAnchorPos());
	const pinScreenPositions = $derived(getPinScreenPositions());

	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);
</script>

{#if anchorPos && countryArtists.length > 0}
	<div class="pointer-events-none absolute inset-0 z-[60]">
		<!-- SVG lines from anchor to each pin -->
		<svg class="pointer-events-none absolute inset-0 h-full w-full">
			{#each countryArtists as _, i (i)}
				{@const pin = pinScreenPositions[i]}
				{#if pin?.visible}
					{@const fanOffset = (i - (countryArtists.length - 1) / 2) * 0.5}
					{@const startX = anchorPos.x + fanOffset}
					{@const startY = anchorPos.y}
					{@const endX = pin.x}
					{@const endY = pin.y}
					{@const ctrlX = startX + (endX - startX) * 0.5}
					{@const ctrlY = startY + (endY - startY) * 0.2}
					<path
						d="M {startX} {startY} Q {ctrlX} {ctrlY} {endX} {endY}"
						stroke="black"
						stroke-width="1"
						fill="none"
						opacity="0.15"
					/>
				{/if}
			{/each}
		</svg>

		<!-- Artist pins -->
		{#each countryArtists as artist, i (artist.id)}
			{@const pin = pinScreenPositions[i]}
			{#if pin?.visible}
				<button
					type="button"
					class="pointer-events-auto absolute flex cursor-pointer touch-manipulation flex-col items-center gap-1 border-none bg-transparent p-1"
					style="
						left: {pin.x}px;
						top: {pin.y}px;
						transform: translate(-50%, -50%) scale({pin.scale});
					"
					in:fly={{ y: 20, duration: 300, delay: Math.min(i * 30, 600) }}
					out:fly={{ y: 20, duration: 200 }}
					onclick={() => openArtistDrawer(artist)}
					ontouchend={(e) => {
						e.preventDefault();
						e.stopPropagation();
						openArtistDrawer(artist);
					}}
				>
					<div class="h-[60px] w-[60px] overflow-hidden sm:h-[50px] sm:w-[50px]">
						<img
							src={artist.imageUrl}
							alt={artist.name}
							class="h-full w-full object-cover"
							draggable="false"
						/>
					</div>
					<span
						class="font-mono text-[0.55rem] font-medium tracking-widest text-black uppercase drop-shadow-sm sm:text-[0.5rem]"
					>
						{artist.name}
					</span>
				</button>
			{/if}
		{/each}
	</div>
{/if}
