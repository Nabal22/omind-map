<script lang="ts">
	import { fly, scale as scaleTransition } from 'svelte/transition';
	import { artists } from '$lib/data/artists';
	import {
		getAnchorPos,
		getPinScreenPositions,
		getHiddenArtistCount
	} from '$lib/stores/globe-overlay.svelte';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	interface Props {
		selectedCountry: string | null;
	}

	let { selectedCountry }: Props = $props();

	const anchorPos = $derived(getAnchorPos());
	const pinScreenPositions = $derived(getPinScreenPositions());
	const hiddenCount = $derived(getHiddenArtistCount());

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
					{@const startX = anchorPos.x}
					{@const startY = anchorPos.y}
					{@const endX = pin.x}
					{@const endY = pin.y}
					{@const ctrlX = startX + (endX - startX) * 0.5}
					{@const ctrlY = startY + (endY - startY) * 0.15}
					<path
						d="M {startX} {startY} Q {ctrlX} {ctrlY} {endX} {endY}"
						stroke="black"
						stroke-width="0.8"
						fill="none"
						opacity={0.12 - pin.ring * 0.02}
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
					in:scaleTransition={{ duration: 250, delay: Math.min(i * 20, 400), start: 0.3 }}
					out:fly={{ y: 10, duration: 150 }}
					onclick={() => openArtistDrawer(artist)}
					ontouchend={(e) => {
						e.preventDefault();
						e.stopPropagation();
						openArtistDrawer(artist);
					}}
				>
					<div class="h-[20px] w-[20px] overflow-hidden sm:h-[30px] sm:w-[30px]">
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

		<!-- "Zoom to reveal more" badge -->
		{#if hiddenCount > 0}
			<div
				class="pointer-events-none absolute flex flex-col items-center gap-0.5"
				style="left: {anchorPos.x}px; top: {anchorPos.y + 30}px; transform: translate(-50%, 0);"
				in:scaleTransition={{ duration: 200, start: 0.5 }}
			>
				<span
					class="rounded-full bg-black/70 px-2.5 py-1 font-mono text-[0.6rem] tracking-wider text-white"
				>
					+{hiddenCount}
				</span>
				<span class="font-mono text-[0.45rem] tracking-wider text-black/40 uppercase">
					zoom to reveal
				</span>
			</div>
		{/if}
	</div>
{/if}
