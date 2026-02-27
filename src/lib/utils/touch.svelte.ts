import { TAP_THRESHOLD } from '$lib/config';

interface TouchState {
	x: number;
	y: number;
	touches: number;
}

/**
 * Creates a tap detector that distinguishes taps from pinch/drag gestures.
 */
export function createTapDetector() {
	let touchStart: TouchState | null = null;

	return {
		onTouchStart(e: TouchEvent) {
			touchStart = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
				touches: e.touches.length
			};
		},

		onTouchEnd(e: TouchEvent, callback: () => void) {
			if (!touchStart || touchStart.touches > 1) {
				touchStart = null;
				return;
			}
			const touch = e.changedTouches[0];
			const dx = Math.abs(touch.clientX - touchStart.x);
			const dy = Math.abs(touch.clientY - touchStart.y);
			if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD) {
				e.preventDefault();
				callback();
			}
			touchStart = null;
		}
	};
}

/**
 * Native-feeling swipe-to-dismiss for bottom sheets.
 * Returns reactive state + a Svelte action that binds non-passive touch listeners
 * so preventDefault() actually works and the panel sticks to your finger.
 */
export function createSwipeToDismiss(onDismiss: () => void) {
	let dragY = $state(0);
	let dragging = $state(false);
	let animating = $state(false);
	let startY = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let isScrolling = false;
	let touchTarget: Node | null = null;

	const VELOCITY_THRESHOLD = 0.4;
	const DISTANCE_THRESHOLD = 60;
	const RUBBER_BAND_FACTOR = 0.25;

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
		lastY = startY;
		lastTime = performance.now();
		velocity = 0;
		isScrolling = false;
		dragging = true;
		dragY = 0;

		const scrollable = findScrollableAncestor(touchTarget, this);
		if (scrollable && scrollable.scrollTop > 0) {
			isScrolling = true;
		}
	}

	function handleTouchMove(this: HTMLElement, e: TouchEvent) {
		if (!dragging || animating) return;

		const currentY = e.touches[0].clientY;
		const now = performance.now();
		const dt = now - lastTime;
		if (dt > 0) velocity = (currentY - lastY) / dt;
		lastY = currentY;
		lastTime = now;

		if (isScrolling) {
			const scrollable = findScrollableAncestor(touchTarget, this);
			if (scrollable && scrollable.scrollTop > 0) return;
			isScrolling = false;
			startY = currentY;
			return;
		}

		const delta = currentY - startY;

		if (delta < 0) {
			dragY = delta * RUBBER_BAND_FACTOR;
		} else {
			dragY = delta;
			if (e.cancelable) e.preventDefault();
		}
	}

	function handleTouchEnd() {
		if (!dragging || animating) return;
		dragging = false;
		touchTarget = null;

		if (isScrolling) {
			dragY = 0;
			return;
		}

		const shouldDismiss =
			dragY > DISTANCE_THRESHOLD || (dragY > 15 && velocity > VELOCITY_THRESHOLD);

		if (shouldDismiss) {
			animating = true;
			dragY = window.innerHeight;
			setTimeout(() => {
				onDismiss();
				dragY = 0;
				animating = false;
			}, 280);
		} else {
			dragY = 0;
		}
	}

	/** Svelte action — use as `use:swipeAction` on the panel element */
	function action(node: HTMLElement) {
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

	return {
		get dragY() {
			return dragY;
		},
		get dragging() {
			return dragging;
		},
		get animating() {
			return animating;
		},
		get progress() {
			return Math.min(1, Math.max(0, dragY) / 200);
		},
		action
	};
}

/**
 * Creates an outside-tap detector for dismissing panels.
 */
export function createOutsideTapDetector(
	getElement: () => HTMLElement | null,
	onOutsideTap: () => void
) {
	let start: { x: number; y: number } | null = null;
	let tracking = false;

	return {
		onTouchStart(e: TouchEvent) {
			const el = getElement();
			if (el?.contains(e.target as Node)) return;
			const t = e.touches[0];
			start = { x: t.clientX, y: t.clientY };
			tracking = true;
		},

		onTouchEnd(e: TouchEvent) {
			if (!tracking || !start) return;
			tracking = false;
			const t = e.changedTouches[0];
			const dx = Math.abs(t.clientX - start.x);
			const dy = Math.abs(t.clientY - start.y);
			if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD) {
				onOutsideTap();
			}
			start = null;
		}
	};
}
