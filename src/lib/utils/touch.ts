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
