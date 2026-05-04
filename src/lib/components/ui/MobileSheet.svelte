<script lang="ts">
	import { fade } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import { artists, type Artist } from '$lib/data/artists';
	import { haptic } from '$lib/utils/haptics';
	import ArtistDetails from './ArtistDetails.svelte';

	interface Props {
		selectedCountry: string | null;
		selectedArtist: Artist | null;
		onCloseCountry: () => void;
		onCloseArtist: () => void;
		onArtistSelect: (artist: Artist) => void;
	}

	let { selectedCountry, selectedArtist, onCloseCountry, onCloseArtist, onArtistSelect }: Props =
		$props();

	type State = 'closed' | 'country' | 'artist';
	type Detent = 'medium' | 'large';

	const sheetState: State = $derived(
		selectedArtist ? 'artist' : selectedCountry ? 'country' : 'closed'
	);
	const open = $derived(sheetState !== 'closed');

	// Detent heights (vh / dvh)
	const MEDIUM_VH = 45;
	const LARGE_DVH = 75;

	let detent = $state<Detent>('medium');
	let mounted = $state(false);

	// Always default to medium when transitioning between states.
	// User can drag up to large for more room.
	let prevState: State = 'closed';
	$effect(() => {
		const next = sheetState;
		if (prevState === 'closed' && next !== 'closed') detent = 'medium';
		else if (prevState === 'artist' && next === 'country') detent = 'medium';
		prevState = next;
	});

	// Keep an artist snapshot for clean exit animation
	let displayArtist = $state<Artist | null>(null);
	$effect(() => {
		if (selectedArtist) displayArtist = selectedArtist;
	});
	$effect(() => {
		if (open) {
			mounted = true;
		} else {
			const t = setTimeout(() => {
				mounted = false;
				displayArtist = null;
			}, 300);
			return () => clearTimeout(t);
		}
	});

	// Drag state
	let dragOffset = $state(0); // vertical px, positive = moving down
	let dragX = $state(0); // horizontal px, positive = moving right (artist back gesture)
	let dragDirection = $state<'none' | 'horizontal' | 'vertical'>('none');
	let dragging = $state(false);
	let animating = $state(false);
	let startY = 0;
	let startX = 0;
	let startOffset = 0;
	let lastY = 0;
	let lastX = 0;
	let lastTime = 0;
	let velocity = 0;
	let velocityX = 0;
	let isScrollingContent = false;
	let touchTarget: Node | null = null;

	const DISMISS_PX = 100;
	const HORIZONTAL_DISMISS_PX = 80;
	const VELOCITY_THRESHOLD = 0.5;
	const DIRECTION_LOCK_PX = 8;

	function vh(): number {
		return window.innerHeight;
	}

	function detentOffsetPx(d: Detent): number {
		// Sheet always sized to LARGE; medium is achieved by translating it down
		// by (large - medium) so only the top portion is visible.
		const h = vh();
		return d === 'large' ? 0 : (h * (LARGE_DVH - MEDIUM_VH)) / 100;
	}

	const translateY = $derived.by(() => {
		if (!mounted) return '100%';
		if (!open) return '100%';
		if (typeof window === 'undefined') return '0px';
		const detentY = detentOffsetPx(detent);
		return `${detentY + dragOffset}px`;
	});

	// Opacity fades during drag-to-dismiss only (gives "you're dismissing" feedback)
	const dismissProgress = $derived.by(() => {
		if (!dragging || dragOffset <= 0) return 0;
		return Math.min(1, dragOffset / DISMISS_PX);
	});

	function findScrollableAncestor(target: Node | null, container: HTMLElement): HTMLElement | null {
		let el = target as HTMLElement | null;
		while (el && el !== container) {
			const style = window.getComputedStyle(el);
			const overflowY = style.overflowY;
			if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
				return el;
			}
			el = el.parentElement;
		}
		return null;
	}

	function handleTouchStart(this: HTMLElement, e: TouchEvent) {
		if (animating) return;
		touchTarget = e.target as Node;
		startY = e.touches[0].clientY;
		startX = e.touches[0].clientX;
		startOffset = dragOffset;
		lastY = startY;
		lastX = startX;
		lastTime = performance.now();
		velocity = 0;
		velocityX = 0;
		isScrollingContent = false;
		dragDirection = 'none';
		dragging = true;

		const scrollable = findScrollableAncestor(touchTarget, this);
		if (scrollable && scrollable.scrollTop > 0) isScrollingContent = true;
	}

	function handleTouchMove(this: HTMLElement, e: TouchEvent) {
		if (!dragging || animating) return;
		const currentY = e.touches[0].clientY;
		const currentX = e.touches[0].clientX;
		const now = performance.now();
		const dt = now - lastTime;
		if (dt > 0) {
			velocity = (currentY - lastY) / dt;
			velocityX = (currentX - lastX) / dt;
		}
		lastY = currentY;
		lastX = currentX;
		lastTime = now;

		const deltaY = currentY - startY;
		const deltaX = currentX - startX;

		// Direction lock at first significant movement
		if (dragDirection === 'none') {
			const absX = Math.abs(deltaX);
			const absY = Math.abs(deltaY);
			if (Math.max(absX, absY) < DIRECTION_LOCK_PX) return;
			// Only allow horizontal swipe-back when on artist screen and moving rightward
			if (absX > absY && sheetState === 'artist' && deltaX > 0) {
				dragDirection = 'horizontal';
			} else {
				dragDirection = 'vertical';
			}
		}

		if (dragDirection === 'horizontal') {
			dragX = Math.max(0, deltaX);
			if (e.cancelable) e.preventDefault();
			return;
		}

		// Vertical
		if (isScrollingContent) {
			const scrollable = findScrollableAncestor(touchTarget, this);
			if (scrollable && scrollable.scrollTop > 0) return;
			isScrollingContent = false;
			startY = currentY;
			startOffset = dragOffset;
			return;
		}

		const newOffset = startOffset + deltaY;

		// Rubber-band beyond LARGE detent (above its top): pull-up resistance
		const totalY = detentOffsetPx(detent) + newOffset;
		if (totalY < 0) {
			const overshoot = totalY; // negative
			dragOffset = -detentOffsetPx(detent) + overshoot * 0.25;
		} else {
			dragOffset = newOffset;
		}

		// Prevent page scroll while sheet is being dragged
		if (e.cancelable) e.preventDefault();
	}

	function handleTouchEnd() {
		if (!dragging || animating) return;
		dragging = false;
		touchTarget = null;

		// Horizontal: artist → country (back gesture)
		if (dragDirection === 'horizontal') {
			const fastRight = velocityX > VELOCITY_THRESHOLD;
			const exitRight = dragX > HORIZONTAL_DISMISS_PX || (dragX > 30 && fastRight);
			if (exitRight) {
				animateBackToCountry();
			} else {
				dragX = 0;
			}
			dragDirection = 'none';
			return;
		}

		// Vertical: swipe-down past threshold = close everything
		const downward = dragOffset;
		const fastDown = velocity > VELOCITY_THRESHOLD;
		const exitDown = downward > DISMISS_PX || (downward > 30 && fastDown);

		if (exitDown) {
			haptic('success');
			animateClose(() => {
				onCloseArtist();
				onCloseCountry();
			});
			return;
		}

		snapToNearestDetent();
	}

	function animateBackToCountry() {
		haptic('light');
		animating = true;
		dragX = window.innerWidth;
		setTimeout(() => {
			onCloseArtist();
			dragX = 0;
			animating = false;
		}, 280);
	}

	function snapToNearestDetent() {
		const totalY = detentOffsetPx(detent) + dragOffset;
		const mediumY = detentOffsetPx('medium');
		const largeY = 0;
		const newDetent: Detent =
			Math.abs(totalY - mediumY) < Math.abs(totalY - largeY) ? 'medium' : 'large';

		if (newDetent !== detent) {
			detent = newDetent;
			haptic('light');
		}
		dragOffset = 0;
	}

	function animateClose(action: () => void) {
		animating = true;
		dragOffset = vh();
		setTimeout(() => {
			action();
			dragOffset = 0;
			animating = false;
		}, 280);
	}

	function sheetAction(node: HTMLElement) {
		node.addEventListener('touchstart', handleTouchStart, { passive: true });
		node.addEventListener('touchmove', handleTouchMove, { passive: false });
		node.addEventListener('touchend', handleTouchEnd, { passive: true });
		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', handleTouchEnd);
			}
		};
	}

	// Country list data
	const countryArtists = $derived(
		selectedCountry ? artists.filter((a) => a.country === selectedCountry) : []
	);

	// Keyboard nav (country state)
	let focusedIndex = $state(-1);
	$effect(() => {
		void countryArtists;
		focusedIndex = -1;
	});

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			if (sheetState === 'artist') onCloseArtist();
			else onCloseCountry();
			return;
		}
		if (sheetState !== 'country') return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			focusedIndex = focusedIndex < countryArtists.length - 1 ? focusedIndex + 1 : 0;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : countryArtists.length - 1;
		} else if (e.key === 'Enter' && focusedIndex >= 0) {
			onArtistSelect(countryArtists[focusedIndex]);
		}
	}

	beforeNavigate(() => {
		if (selectedArtist) onCloseArtist();
		if (selectedCountry) onCloseCountry();
	});

	function handleBack() {
		haptic('light');
		onCloseArtist();
	}

	function handleClose() {
		haptic('light');
		if (sheetState === 'artist') onCloseArtist();
		else onCloseCountry();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mounted}
	<!-- Backdrop only when viewing artist details: tap to go back to country list -->
	{#if sheetState === 'artist'}
		<button
			class="fixed inset-0 z-[55] border-none bg-black/30 p-0 transition-opacity duration-200 sm:hidden"
			style="opacity: {open ? 1 - dismissProgress * 0.5 : 0};"
			onclick={() => {
				haptic('light');
				onCloseArtist();
			}}
			aria-label="Back to country list"
			transition:fade={{ duration: 200 }}
		></button>
	{/if}

	<!-- Rubber-band white filler for over-pull above large detent -->
	<div
		class="pointer-events-none fixed right-0 bottom-0 left-0 z-[56] bg-white sm:hidden"
		style="height: {Math.max(0, -dragOffset)}px; transition: {dragging
			? 'none'
			: 'height 200ms cubic-bezier(0.25, 1, 0.5, 1)'};"
		aria-hidden="true"
	></div>

	<!-- Sheet -->
	<div
		class="fixed inset-x-0 bottom-0 z-[57] flex touch-manipulation flex-col overscroll-contain border-t border-black/10 bg-white font-mono text-black sm:hidden"
		style="height: {LARGE_DVH}dvh; transform: translateY({translateY}); opacity: {1 -
			dismissProgress * 0.3}; transition: {dragging
			? 'none'
			: 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease'}; {open
			? ''
			: 'pointer-events: none;'}"
		use:sheetAction
		role="dialog"
		aria-modal={sheetState === 'artist'}
		tabindex="-1"
	>
		<!-- Handle -->
		<div class="flex shrink-0 justify-center py-2.5">
			<div class="h-1 w-10 rounded-full bg-black/15"></div>
		</div>

		<!-- Header: back-to-country button on artist (only if country context exists), country name on country state -->
		<div class="relative flex shrink-0 items-center justify-between px-4 pb-2">
			{#if sheetState === 'artist' && selectedCountry}
				<button
					class="flex h-7 cursor-pointer items-center gap-1 border-none bg-transparent px-0 text-[0.65rem] tracking-[0.15em] text-black/50 uppercase focus-ring transition-colors duration-150 hover:text-pink"
					onclick={handleBack}
					aria-label="Back to country list"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
					<span>{selectedCountry}</span>
				</button>
			{:else if sheetState === 'country' && selectedCountry}
				<h3 class="text-xs font-bold tracking-[0.15em] text-black/50 uppercase">
					{selectedCountry}
				</h3>
			{:else}
				<span></span>
			{/if}

			<button
				class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent text-black/30 transition-colors duration-150 hover:text-black/60"
				onclick={handleClose}
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
				>
			</button>
		</div>

		<!-- Content area: scrollable -->
		<div class="flex-1 overflow-y-auto px-4 pb-safe">
			{#if sheetState === 'artist' && displayArtist}
				<div
					in:fade={{ duration: 150 }}
					style="transform: translateX({dragX}px); opacity: {Math.max(
						0,
						1 - dragX / 250
					)}; transition: {dragging || animating
						? dragging
							? 'none'
							: 'transform 280ms cubic-bezier(0.25, 1, 0.5, 1), opacity 280ms ease'
						: 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease'};"
				>
					<ArtistDetails artist={displayArtist} />
				</div>
			{:else if sheetState === 'country'}
				<div in:fade={{ duration: 150 }}>
					{#if countryArtists.length === 0}
						<p class="py-4 text-center text-[0.7rem] text-black/30">No artists yet</p>
					{:else}
						<ul class="space-y-0">
							{#each countryArtists as artist, i (artist.id)}
								<li>
									<button
										class="min-h-[44px] w-full cursor-pointer border-b border-black/5 bg-transparent py-3 text-left font-mono focus-ring transition-all duration-150 hover:opacity-60 {focusedIndex ===
										i
											? 'border-l-2 border-l-pink pl-2'
											: 'px-0'}"
										onclick={() => {
											haptic('medium');
											onArtistSelect(artist);
										}}
									>
										<span class="block text-xs tracking-[0.05em] text-pink uppercase"
											>{artist.name}</span
										>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
