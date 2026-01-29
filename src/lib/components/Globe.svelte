<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import type ThreeGlobe from 'three-globe';

	import { artists } from '$lib/data/artists';
	import { GLOBE_RADIUS, CAMERA_DISTANCE, ZOOM_DISTANCE, COLORS } from '$lib/utils/globe-constants';
	import { loadGeoJSON, getCountryCentroid, type GeoFeature } from '$lib/utils/geo-utils';
	import { createGlobe, setGlobePolygons, updatePolygonColors } from '$lib/utils/globe-factory';
	import { createGlobeInteractions } from '$lib/utils/globe-interactions';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
	}

	let { onCountryClick, selectedCountry }: Props = $props();

	const { camera, renderer, invalidate } = useThrelte();

	// State
	let globe = $state<ThreeGlobe | null>(null);
	let cameraTarget = $state<{ position: THREE.Vector3; lookAt: THREE.Vector3 } | null>(null);
	let hoveredCountry = $state<string | null>(null);
	let geoFeatures = $state<GeoFeature[]>([]);

	// Derived
	const countriesWithArtists = new Set(artists.map((a) => a.country));

	// Polygon color based on state
	function getPolygonColor(d: GeoFeature): string {
		const name = d.properties?.NAME;
		if (name === selectedCountry) return COLORS.selected;
		if (name === hoveredCountry && countriesWithArtists.has(name)) return COLORS.hovered;
		if (countriesWithArtists.has(name)) return COLORS.hasArtists;
		return COLORS.transparent;
	}

	// Camera animations
	function animateCameraToCountry(feature: GeoFeature) {
		if (!globe) return;

		const centroid = getCountryCentroid(feature);
		const altitude = (ZOOM_DISTANCE - GLOBE_RADIUS) / GLOBE_RADIUS;
		const pos = globe.getCoords(centroid.lat, centroid.lng, altitude);

		cameraTarget = {
			position: new THREE.Vector3(pos.x, pos.y, pos.z),
			lookAt: new THREE.Vector3(0, 0, 0)
		};
	}

	function animateCameraZoomOut() {
		if (!$camera) return;
		const cam = $camera as THREE.PerspectiveCamera;
		const direction = cam.position.clone().normalize();

		cameraTarget = {
			position: direction.multiplyScalar(CAMERA_DISTANCE),
			lookAt: new THREE.Vector3(0, 0, 0)
		};
	}

	// Event handlers
	function handleCountryClick(feature: GeoFeature) {
		const name = feature.properties?.NAME;
		if (name && countriesWithArtists.has(name)) {
			onCountryClick(name);
			animateCameraToCountry(feature);
		}
	}

	function handleCountryHover(feature: GeoFeature | null) {
		const newHovered = feature?.properties?.NAME || null;
		if (newHovered !== hoveredCountry) {
			hoveredCountry = newHovered;
			invalidate();
		}
	}

	// Initialize globe
	$effect(() => {
		const g = createGlobe({ polygonColorFn: getPolygonColor });

		loadGeoJSON('/data/ne_110m_countries.geojson').then((features) => {
			geoFeatures = features;
			setGlobePolygons(g, features);
			globe = g;
		});
	});

	// Update colors when selection/hover changes
	$effect(() => {
		if (!globe) return;
		updatePolygonColors(globe, getPolygonColor);
	});

	// Handle deselection - zoom out
	let prevSelectedCountry: string | null = null;
	$effect(() => {
		if (prevSelectedCountry && !selectedCountry) {
			animateCameraZoomOut();
		}
		prevSelectedCountry = selectedCountry;
	});

	// Setup interactions
	$effect(() => {
		if (!globe || !renderer || !$camera) return;

		return createGlobeInteractions(
			{
				globe,
				camera: $camera as THREE.Camera,
				canvas: renderer.domElement,
				features: geoFeatures
			},
			{
				onHover: handleCountryHover,
				onClick: handleCountryClick
			}
		);
	});

	// Animate camera
	useTask((delta) => {
		if (!cameraTarget || !$camera) return;
		const cam = $camera as THREE.PerspectiveCamera;
		cam.position.lerp(cameraTarget.position, delta * 5);
		cam.lookAt(cameraTarget.lookAt);
		if (cam.position.distanceTo(cameraTarget.position) < 1) cameraTarget = null;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, CAMERA_DISTANCE]} fov={45}>
	<OrbitControls
		enableDamping
		dampingFactor={0.05}
		enableZoom
		minDistance={120}
		maxDistance={400}
		enablePan={false}
		autoRotate={!selectedCountry && !cameraTarget}
		autoRotateSpeed={0.3}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight position={[500, 300, 500]} intensity={1} />

{#if globe}
	<T is={globe} />
{/if}
