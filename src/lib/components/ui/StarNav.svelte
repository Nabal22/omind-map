<script lang="ts">
	import { haptic } from '$lib/utils/haptics';
	import { scale, fade } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	interface Props {
		currentPath: string;
		onSearchClick?: () => void;
		hidden?: boolean;
	}

	let { currentPath, onSearchClick, hidden = false }: Props = $props();

	let tappedKey = $state<string | null>(null);
	let tapTimer: ReturnType<typeof setTimeout> | null = null;

	type Item = {
		key: string;
		label: string;
		href?: string;
		action?: 'search';
		positionMobile: string;
		positionDesktop: string;
		bobDelay: string;
		twinkleDelay: string;
		spinDuration: string;
	};

	const items: Item[] = [
		{
			key: 'search',
			label: 'Search',
			action: 'search',
			positionMobile: 'top-[10%] left-[6%]',
			positionDesktop: 'sm:top-[16%] sm:left-[5%]',
			bobDelay: '0s',
			twinkleDelay: '0.2s',
			spinDuration: '38s'
		},
		{
			key: 'shop',
			label: 'Shop',
			href: '/shop',
			positionMobile: 'top-[7%] left-[55%]',
			positionDesktop: 'sm:top-[9%] sm:left-[58%]',
			bobDelay: '-1.4s',
			twinkleDelay: '1.1s',
			spinDuration: '46s'
		},
		{
			key: 'about',
			label: 'What is Omind?',
			href: '/about',
			positionMobile: 'top-[19%] left-[22%]',
			positionDesktop: 'sm:top-[30%] sm:left-[13%]',
			bobDelay: '-2.6s',
			twinkleDelay: '0.6s',
			spinDuration: '52s'
		},
		{
			key: 'artists',
			label: 'Artists',
			href: '/artists',
			positionMobile: 'top-[22%] right-[6%]',
			positionDesktop: 'sm:top-[26%] sm:right-[8%]',
			bobDelay: '-0.8s',
			twinkleDelay: '1.8s',
			spinDuration: '34s'
		},
		{
			key: 'music',
			label: 'Music',
			href: '/playlists',
			positionMobile: 'top-[70%] left-[12%]',
			positionDesktop: 'sm:top-[68%] sm:left-[9%]',
			bobDelay: '-3.1s',
			twinkleDelay: '0.9s',
			spinDuration: '42s'
		},
		{
			key: 'wtfis',
			label: 'Who the f*** is this?',
			href: '/wtfis',
			positionMobile: 'top-[78%] left-[42%]',
			positionDesktop: 'sm:top-[76%] sm:right-[10%] sm:left-auto',
			bobDelay: '-1.9s',
			twinkleDelay: '1.4s',
			spinDuration: '48s'
		}
	];

	function isActive(itemPath: string | undefined, current: string): boolean {
		if (!itemPath) return false;
		return current === itemPath || current.startsWith(itemPath + '/');
	}

	function handleClick(item: Item, e: MouseEvent) {
		haptic(item.action === 'search' ? 'light' : 'medium');
		if (tapTimer) clearTimeout(tapTimer);
		tappedKey = item.key;
		tapTimer = setTimeout(() => {
			tappedKey = null;
		}, 600);
		if (item.action === 'search') {
			e.preventDefault();
			onSearchClick?.();
		}
	}
</script>

{#if !hidden}
	<div
		class="pointer-events-none fixed inset-0 z-[55] font-mono"
		in:fade={{ duration: 250, delay: 100 }}
		out:fade={{ duration: 150 }}
		aria-label="Primary navigation"
	>
		{#each items as item, index (item.key)}
			{@const active = isActive(item.href, currentPath)}
			<a
				href={item.href ?? '#'}
				onclick={(e) => handleClick(item, e)}
				in:scale={{ duration: 650, delay: 150 + index * 90, start: 0.2, easing: backOut }}
				out:fade={{ duration: 150 }}
				class="star-link group pointer-events-auto absolute flex items-center gap-2 focus-ring {item.positionMobile} {item.positionDesktop} {tappedKey ===
				item.key
					? 'tapped'
					: ''}"
				style="--bob-delay: {item.bobDelay}; --twinkle-delay: {item.twinkleDelay}; --spin-duration: {item.spinDuration};"
				aria-label={item.action === 'search' ? 'Open search' : item.label}
			>
				<span
					class="star-wrap relative inline-flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11"
				>
					<img src="/assets/star.png" alt="" class="star-img h-full w-full select-none" />
					<!-- Sparkles burst on hover -->
					<span class="sparkle sparkle-1" aria-hidden="true"></span>
					<span class="sparkle sparkle-2" aria-hidden="true"></span>
					<span class="sparkle sparkle-3" aria-hidden="true"></span>
					<span class="sparkle sparkle-4" aria-hidden="true"></span>
				</span>
				<span
					class="star-label text-sm tracking-wide transition-colors duration-150 sm:text-base {active
						? 'text-pink-highlight'
						: 'text-black group-hover:text-pink-highlight'}"
				>
					{item.label}
				</span>
			</a>
		{/each}
	</div>
{/if}

<style>
	.star-link {
		transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.star-link:hover {
		transform: scale(1.18);
	}

	.star-link:active {
		transform: scale(0.92);
		transition-duration: 80ms;
	}

	.star-link.tapped {
		animation: tap-pop 500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.star-link.tapped .star-img {
		animation:
			twinkle 0.6s ease-in-out 2,
			spin 1.2s linear;
		filter: drop-shadow(0 0 18px rgba(255, 145, 249, 1))
			drop-shadow(0 0 6px rgba(255, 255, 255, 0.85));
	}

	.star-link.tapped .sparkle {
		animation: sparkle-burst 700ms ease-out forwards;
	}
	.star-link.tapped .sparkle-2 {
		animation-delay: 60ms !important;
	}
	.star-link.tapped .sparkle-3 {
		animation-delay: 120ms !important;
	}
	.star-link.tapped .sparkle-4 {
		animation-delay: 180ms !important;
	}

	@keyframes tap-pop {
		0% {
			transform: scale(0.92);
		}
		40% {
			transform: scale(1.3);
		}
		100% {
			transform: scale(1);
		}
	}

	.star-wrap {
		animation: bob 5s ease-in-out var(--bob-delay, 0s) infinite alternate;
		will-change: transform;
		transform-origin: center;
	}

	.star-img {
		filter: drop-shadow(0 0 6px rgba(255, 174, 251, 0.55));
		animation:
			twinkle 2.6s ease-in-out var(--twinkle-delay, 0s) infinite,
			spin var(--spin-duration, 40s) linear infinite;
		transform-origin: center;
		will-change: transform, filter;
	}

	.star-link:hover .star-img {
		animation:
			twinkle 1s ease-in-out infinite,
			spin 4s linear infinite;
		filter: drop-shadow(0 0 14px rgba(255, 145, 249, 0.95))
			drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
	}

	@keyframes bob {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-5px);
		}
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.85;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Sparkles */
	.sparkle {
		position: absolute;
		width: 6px;
		height: 6px;
		background: radial-gradient(circle, #fff 0%, #ffaefb 60%, transparent 70%);
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
		filter: drop-shadow(0 0 3px #ffaefb);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) scale(0);
	}

	.star-link:hover .sparkle {
		animation: sparkle-burst 700ms ease-out forwards;
	}

	.sparkle-1 {
		--sx: -22px;
		--sy: -18px;
		animation-delay: 0ms !important;
	}
	.sparkle-2 {
		--sx: 24px;
		--sy: -14px;
	}
	.sparkle-3 {
		--sx: -20px;
		--sy: 22px;
	}
	.sparkle-4 {
		--sx: 26px;
		--sy: 18px;
	}

	.star-link:hover .sparkle-2 {
		animation-delay: 80ms !important;
	}
	.star-link:hover .sparkle-3 {
		animation-delay: 140ms !important;
	}
	.star-link:hover .sparkle-4 {
		animation-delay: 200ms !important;
	}

	@keyframes sparkle-burst {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: translate(calc(-50% + var(--sx, 0px)), calc(-50% + var(--sy, 0px))) scale(1.2);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.star-wrap,
		.star-img,
		.sparkle,
		.star-link:hover .star-img,
		.star-link:hover .sparkle {
			animation: none !important;
		}
		.star-link:hover {
			transform: scale(1.08);
		}
	}
</style>
