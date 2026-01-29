import * as THREE from 'three';
import type ThreeGlobe from 'three-globe';
import { CLICK_THRESHOLD, CLICK_TIME_THRESHOLD, HOVER_THROTTLE } from './globe-constants';
import { vector3ToLatLng, findCountryAtPoint, type GeoFeature } from './geo-utils';

export interface RaycastContext {
	globe: ThreeGlobe;
	camera: THREE.Camera;
	canvas: HTMLCanvasElement;
	features: GeoFeature[];
}

export interface InteractionCallbacks {
	onHover: (feature: GeoFeature | null) => void;
	onClick: (feature: GeoFeature) => void;
}

/**
 * Create mouse interaction handlers for the globe
 */
export function createGlobeInteractions(
	context: RaycastContext,
	callbacks: InteractionCallbacks
): () => void {
	const { globe, camera, canvas, features } = context;
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	let lastHoverTime = 0;
	let mouseDownPos = { x: 0, y: 0 };
	let mouseDownTime = 0;

	function getMouseCoords(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
			y: -((event.clientY - rect.top) / rect.height) * 2 + 1
		};
	}

	function getIntersectedCountry(event: MouseEvent): GeoFeature | null {
		if (features.length === 0) return null;

		const coords = getMouseCoords(event);
		mouse.x = coords.x;
		mouse.y = coords.y;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObject(globe, true);

		if (intersects.length > 0) {
			const point = intersects[0].point;
			const { lat, lng } = vector3ToLatLng(point, globe);
			return findCountryAtPoint(lat, lng, features);
		}
		return null;
	}

	function onMouseMove(event: MouseEvent) {
		const now = Date.now();
		if (now - lastHoverTime < HOVER_THROTTLE) return;
		lastHoverTime = now;

		const country = getIntersectedCountry(event);
		callbacks.onHover(country);
	}

	function onMouseDown(event: MouseEvent) {
		if (event.target === canvas) {
			mouseDownPos = { x: event.clientX, y: event.clientY };
			mouseDownTime = Date.now();
		} else {
			mouseDownTime = 0;
		}
	}

	function onMouseUp(event: MouseEvent) {
		if (mouseDownTime === 0) return;

		const dx = event.clientX - mouseDownPos.x;
		const dy = event.clientY - mouseDownPos.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const duration = Date.now() - mouseDownTime;

		if (distance < CLICK_THRESHOLD && duration < CLICK_TIME_THRESHOLD) {
			const country = getIntersectedCountry(event);
			if (country) {
				callbacks.onClick(country);
			}
		}
	}

	// Attach listeners
	canvas.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mouseup', onMouseUp);

	// Return cleanup function
	return () => {
		canvas.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mousedown', onMouseDown);
		window.removeEventListener('mouseup', onMouseUp);
	};
}
