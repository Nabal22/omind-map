<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';
	import { findCountryFeature } from '$lib/utils/globe-geometry';
	import { setAnchorPos, setPinScreenPositions } from '$lib/stores/globe-overlay.svelte';
	import { artists } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		geoData: GeoJSONData | null;
	}

	let { selectedCountry, geoData }: Props = $props();

	const { camera, size } = useThrelte();

	const GLOBE_RADIUS = 1.0;
	const PIN_LIFT = 0.06;

	function computePinLatLngs(
		centroid: { lat: number; lng: number },
		count: number
	): { lat: number; lng: number }[] {
		if (count === 0) return [];

		const lngCorrection = 1 / Math.max(Math.cos(centroid.lat * Math.PI / 180), 0.3);
		const baseSpread = 8;

		if (count === 1) {
			return [{ lat: centroid.lat + baseSpread, lng: centroid.lng }];
		}

		if (count === 2) {
			return [
				{ lat: centroid.lat + baseSpread * 0.5, lng: centroid.lng - baseSpread * 0.7 * lngCorrection },
				{ lat: centroid.lat + baseSpread * 0.5, lng: centroid.lng + baseSpread * 0.7 * lngCorrection }
			];
		}

		// Distribute in concentric rings — auto-scale ring count based on artist count
		const positions: { lat: number; lng: number }[] = [];
		let placed = 0;
		let ring = 0;

		while (placed < count) {
			const ringRadius = baseSpread * (ring + 1) * 0.7;
			// More artists per ring as radius grows
			const capacity = ring === 0 ? Math.min(count, 6) : Math.floor(Math.PI * 2 * ringRadius / baseSpread * 0.8);
			const ringCount = Math.min(capacity, count - placed);
			const angleOffset = ring * 0.3; // stagger rings

			for (let i = 0; i < ringCount; i++) {
				const angle = (i / ringCount) * Math.PI * 2 - Math.PI / 2 + angleOffset;
				positions.push({
					lat: centroid.lat + Math.sin(angle) * ringRadius,
					lng: centroid.lng + Math.cos(angle) * ringRadius * lngCorrection
				});
			}

			placed += ringCount;
			ring++;
		}

		return positions;
	}

	useTask(() => {
		if (!selectedCountry || !geoData || !$camera) {
			setAnchorPos(null);
			setPinScreenPositions([]);
			return;
		}

		const feature = findCountryFeature(geoData, selectedCountry);
		if (!feature) {
			setAnchorPos(null);
			setPinScreenPositions([]);
			return;
		}

		const centroid = getCountryCentroid(feature);
		const cam = $camera as THREE.PerspectiveCamera;

		// Project anchor
		const worldPos = latLngToVector3(centroid.lat, centroid.lng, GLOBE_RADIUS);
		const projected = worldPos.clone().project(cam);

		if (projected.z > 1) {
			setAnchorPos(null);
			setPinScreenPositions([]);
			return;
		}

		const ax = ((projected.x + 1) / 2) * $size.width;
		const ay = (1 - (projected.y + 1) / 2) * $size.height;
		setAnchorPos({ x: ax, y: ay });

		const countryArtists = artists.filter((a) => a.country === selectedCountry);
		const pinLatLngs = computePinLatLngs(centroid, countryArtists.length);

		const camPos = cam.position;
		const globeCenter = new THREE.Vector3(0, 0, 0);
		const positions = pinLatLngs.map((ll) => {
			const pinWorld = latLngToVector3(ll.lat, ll.lng, GLOBE_RADIUS + PIN_LIFT);
			const pinProjected = pinWorld.clone().project(cam);

			const dirToPin = pinWorld.clone().sub(globeCenter).normalize();
			const dirToCam = camPos.clone().sub(globeCenter).normalize();
			const dot = dirToPin.dot(dirToCam);

			const dist = pinWorld.distanceTo(camPos);
			const refDist = GLOBE_RADIUS + 1.5;
			const scale = Math.max(0.5, Math.min(1.2, refDist / dist));

			const sx = ((pinProjected.x + 1) / 2) * $size.width;
			const sy = (1 - (pinProjected.y + 1) / 2) * $size.height;

			return {
				x: sx,
				y: sy,
				visible: dot > 0.15 && pinProjected.z <= 1,
				scale
			};
		});

		setPinScreenPositions(positions);
	});
</script>
