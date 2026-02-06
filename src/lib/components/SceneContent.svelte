<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import Globe from './Globe.svelte';
	import { findCountryFeature } from '$lib/utils/globe-geometry';
	import { getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
		focusCountry: string | null;
	}

	let { onCountryClick, selectedCountry, focusCountry }: Props = $props();

	const { camera } = useThrelte();
	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
	interactivity();

	// Constants
	const CAMERA_DISTANCE = 2.5;
	const ZOOM_DISTANCE = 1.8;
	const ANIM_DURATION = 0.5;

	// Animation state
	let animating = $state(false);
	let animProgress = 0;
	let startPos = new THREE.Vector3();
	let targetPos = new THREE.Vector3();
	let startLookAt = new THREE.Vector3();
	let targetLookAt = new THREE.Vector3();

	// GeoData reference for camera animation
	let geoData = $state<GeoJSONData | null>(null);

	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function animateToCountry(countryName: string) {
		if (!geoData || !$camera) return;

		const feature = findCountryFeature(geoData, countryName);
		if (!feature) return;

		const cam = $camera as THREE.PerspectiveCamera;
		const centroid = getCountryCentroid(feature);

		startPos.copy(cam.position);
		targetPos.copy(latLngToVector3(centroid.lat, centroid.lng, ZOOM_DISTANCE));
		startLookAt.set(0, 0, 0);
		targetLookAt.copy(latLngToVector3(centroid.lat, centroid.lng, 0));

		animProgress = 0;
		animating = true;
	}

	function animateZoomOut() {
		if (!$camera) return;

		const cam = $camera as THREE.PerspectiveCamera;
		const direction = cam.position.clone().normalize();

		startPos.copy(cam.position);
		targetPos.copy(direction.multiplyScalar(CAMERA_DISTANCE));
		startLookAt.set(0, 0, 0);
		targetLookAt.set(0, 0, 0);

		animProgress = 0;
		animating = true;
	}

	// React to camera focus
	$effect(() => {
		if (focusCountry && geoData) {
			animateToCountry(focusCountry);
		}
	});

	// React to unfocus
	let prevFocusCountry: string | null = null;
	$effect(() => {
		if (prevFocusCountry && !focusCountry) {
			animateZoomOut();
		}
		prevFocusCountry = focusCountry;
	});

	// Animate camera with easing
	useTask((delta) => {
		if (!animating || !$camera) return;

		const cam = $camera as THREE.PerspectiveCamera;
		animProgress += delta / ANIM_DURATION;

		if (animProgress >= 1) {
			animProgress = 1;
			animating = false;
		}

		const t = easeOutCubic(Math.min(animProgress, 1));
		cam.position.lerpVectors(startPos, targetPos, t);

		const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, t);
		cam.lookAt(currentLookAt);
	});

	function handleGeoDataLoad(data: GeoJSONData) {
		geoData = data;
	}
</script>

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[25, 15, CAMERA_DISTANCE]} fov={isMobile ? 80 : 55}>
	<OrbitControls
		enableDamping
		dampingFactor={0.12}
		rotateSpeed={1.2}
		enableZoom
		minDistance={isMobile ? 2.2 : 1.8}
		maxDistance={isMobile ? 8 : 4}
		enablePan={false}
		autoRotate={!focusCountry && !animating}
		autoRotateSpeed={0.4}
	/>
</T.PerspectiveCamera>

<!-- Lighting -->
<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[5, 3, 5]} intensity={1} />
<T.DirectionalLight position={[-3, -1, -3]} intensity={0.2} />

<!-- Globe -->
<Globe {onCountryClick} {selectedCountry} onGeoDataLoad={handleGeoDataLoad} />
