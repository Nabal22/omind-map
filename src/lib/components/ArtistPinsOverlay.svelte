<script lang="ts">
	import { fly } from 'svelte/transition';
	import { artists } from '$lib/data/artists';
	import { getAnchorPos } from '$lib/stores/globe-overlay.svelte';
	import { openArtistDrawer } from '$lib/stores/artist-drawer.svelte';

	interface Props {
		selectedCountry: string | null;
	}

	let { selectedCountry }: Props = $props();

	const anchorPos = $derived(getAnchorPos());

	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);

	// Fonction pour générer une valeur pseudo-aléatoire déterministe basée sur l'index
	function seededRandom(seed: number): number {
		const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
		return x - Math.floor(x);
	}

	function computePinPositions(
		anchor: { x: number; y: number },
		count: number
	): { x: number; y: number }[] {
		const R = 180;
		const verticalLift = 50;
		if (count === 1) {
			return [{ x: anchor.x, y: anchor.y - R - verticalLift }];
		}
		return Array.from({ length: count }, (_, i) => {
			const t = i / (count - 1); // 0..1
			const angle = t * Math.PI; // 0 (right) → π (left), arc goes up
			return {
				x: anchor.x + Math.cos(angle) * R,
				y: anchor.y - Math.sin(angle) * R - verticalLift
			};
		});
	}

	const pinPositions = $derived(
		anchorPos && countryArtists.length > 0
			? computePinPositions(anchorPos, countryArtists.length)
			: []
	);

	const floatDurations = [2.8, 3.2, 2.5, 3.5, 3.0, 2.6];
	const floatDelays = [0, 0.4, 0.8, 0.2, 0.6, 1.0];
</script>

{#if anchorPos && countryArtists.length > 0}
	<div class="pointer-events-none absolute inset-0 z-[60]">
		<!-- SVG lines from anchor to each pin -->
		<svg class="pointer-events-none absolute inset-0 h-full w-full">
			{#each countryArtists as _, i (i)}
				{#if pinPositions[i]}
					{@const baseRatio = 0.3 + seededRandom(i) * 0.4}
					{@const xOffset = (seededRandom(i + 100) - 0.5) * 60}
					{@const midX = anchorPos.x + (pinPositions[i].x - anchorPos.x) * baseRatio + xOffset}
					<path
						d="M {anchorPos.x} {anchorPos.y} L {midX} {pinPositions[i].y} L {pinPositions[i]
							.x} {pinPositions[i].y}"
						stroke="black"
						stroke-width="1"
						fill="none"
						opacity="0.25"
					/>
				{/if}
			{/each}
		</svg>

		<!-- Artist pins -->
		{#each countryArtists as artist, i (artist.id)}
			{#if pinPositions[i]}
				{@const pos = pinPositions[i]}
				<button
					type="button"
					class="pointer-events-auto absolute flex cursor-pointer touch-manipulation flex-col items-center gap-1.5 border-none bg-transparent p-3 sm:p-0"
					style="
						left: {pos.x}px;
						top: {pos.y}px;
						transform: translate(-50%, -50%);
						animation: float-{i % 6} {floatDurations[i % 6]}s ease-in-out {floatDelays[i % 6]}s infinite;
					"
					in:fly={{ y: 20, duration: 300, delay: i * 80 }}
					out:fly={{ y: 20, duration: 200 }}
					onclick={() => openArtistDrawer(artist)}
					ontouchend={(e) => {
						e.preventDefault();
						e.stopPropagation();
						openArtistDrawer(artist);
					}}
				>
					<div
						class="h-[90px] w-[90px] overflow-hidden rounded-full shadow-lg sm:h-[70px] sm:w-[70px]"
					>
						<img
							src={artist.imageUrl}
							alt={artist.name}
							class="h-full w-full object-cover"
							draggable="false"
						/>
					</div>
					<span
						class="font-mono text-[0.65rem] font-medium tracking-widest text-black uppercase drop-shadow-sm sm:text-[0.6rem]"
					>
						{artist.name}
					</span>
				</button>
			{/if}
		{/each}
	</div>
{/if}

<style>
	@keyframes float-0 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-8px);
		}
	}
	@keyframes float-1 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-6px);
		}
	}
	@keyframes float-2 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-10px);
		}
	}
	@keyframes float-3 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-7px);
		}
	}
	@keyframes float-4 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-9px);
		}
	}
	@keyframes float-5 {
		0%,
		100% {
			transform: translate(-50%, -50%) translateY(0px);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-5px);
		}
	}
</style>
