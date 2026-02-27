import { TAP_THRESHOLD } from '$lib/config';

interface TouchState {
	x: number;
	y: number;
	touches: number;
}

/**
 * Creates a tap detector that distinguishes taps from pinch/drag gestures.
 * Call `onTouchStart` on touchstart and `onTouchEnd` on touchend.
 * The callback fires only for single-finger taps with minimal movement.
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
 * Creates a native-feeling swipe-to-dismiss handler for bottom drawers/panels.
 * Features: velocity-based dismissal, rubber-band resistance when pulling up,
 * opacity fade tied to drag progress, and dragging from anywhere on the panel.
 */
export function createSwipeToDismiss(getElement: () => HTMLElement | null, onDismiss: () => void) {
	let dragY = $state(0);
	let dragging = $state(false);
	let startY = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let isScrollable = false;

	const VELOCITY_THRESHOLD = 0.5; // px/ms — fast flick dismisses
	const DISTANCE_THRESHOLD = 80; // px — slow drag threshold
	const RUBBER_BAND_FACTOR = 0.3; // resistance when pulling up

	function getScrollableParent(target: Node | null, container: HTMLElement): HTMLElement | null {
		let el = target as HTMLElement | null;
		while (el && el !== container) {
			if (el.scrollHeight > el.clientHeight && el.scrollTop > 0) return el;
			el = el.parentElement;
		}
		return null;
	}

	function onTouchMove(e: TouchEvent) {
		if (!dragging) return;
		const currentY = e.touches[0].clientY;
		const now = performance.now();
		const dt = now - lastTime;
		if (dt > 0) velocity = (currentY - lastY) / dt;
		lastY = currentY;
		lastTime = now;

		const delta = currentY - startY;

		if (delta < 0) {
			// Pulling up — rubber-band resistance
			dragY = delta * RUBBER_BAND_FACTOR;
		} else {
			dragY = delta;
		}

		if (delta > 0 && e.cancelable) e.preventDefault();
	}

	function onTouchStart(e: TouchEvent) {
		const el = getElement();
		if (!el) return;

		// If the touch target is inside a scrollable area that's scrolled, let native scroll handle it
		const scrollable = getScrollableParent(e.target as Node, el);
		if (scrollable) {
			isScrollable = true;
			return;
		}
		isScrollable = false;

		startY = e.touches[0].clientY;
		lastY = startY;
		lastTime = performance.now();
		velocity = 0;
		dragging = true;
		dragY = 0;
		el.addEventListener('touchmove', onTouchMove, { passive: false });
	}

	function onTouchEnd() {
		if (isScrollable || !dragging) return;
		const el = getElement();
		el?.removeEventListener('touchmove', onTouchMove);
		dragging = false;

		const shouldDismiss =
			dragY > DISTANCE_THRESHOLD || (dragY > 20 && velocity > VELOCITY_THRESHOLD);

		if (shouldDismiss) {
			onDismiss();
		}
		dragY = 0;
	}

	return {
		get dragY() {
			return dragY;
		},
		get dragging() {
			return dragging;
		},
		get progress() {
			return Math.min(1, Math.max(0, dragY) / 200);
		},
		onTouchStart,
		onTouchEnd
	};
}

/**
 * Creates an outside-tap detector for dismissing panels.
 * Ignores swipe gestures — only fires on stationary taps outside the element.
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
