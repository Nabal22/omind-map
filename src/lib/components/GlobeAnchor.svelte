<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';
	import { findCountryFeature } from '$lib/utils/globe-geometry';
	import {
		setAnchorPos,
		setPinScreenPositions,
		setHiddenArtistCount
	} from '$lib/stores/globe-overlay.svelte';
	import { artists } from '$lib/data/artists';

	interface Props {
		selectedCountry: string | null;
		geoData: GeoJSONData | null;
	}

	let { selectedCountry, geoData }: Props = $props();

	const { camera, size } = useThrelte();

	const GLOBE_RADIUS = 1.0;
	const PIN_LIFT = 0.06;

	// Zoom thresholds: camera distance → max visible rings
	// Closer camera = more rings visible
	const ZOOM_LEVELS = [
		{ maxDist: 1.6, rings: 6 },
		{ maxDist: 1.9, rings: 4 },
		{ maxDist: 2.2, rings: 3 },
		{ maxDist: 2.6, rings: 2 },
		{ maxDist: Infinity, rings: 1 }
	];

	interface RingAssignment {
		lat: number;
		lng: number;
		ring: number;
		artistIndex: number;
	}

	function computeRingAssignments(
		centroid: { lat: number; lng: number },
		count: number
	): RingAssignment[] {
		if (count === 0) return [];

		const lngCorrection =
			1 / Math.max(Math.cos((centroid.lat * Math.PI) / 180), 0.3);
		const baseSpread = 7;
		const assignments: RingAssignment[] = [];
		let placed = 0;
		let ring = 0;

		while (placed < count) {
			const ringRadius = baseSpread * (ring + 1) * 0.65;
			const capacity =
				ring === 0
					? Math.min(count, 5)
					: Math.floor(((Math.PI * 2 * ringRadius) / baseSpread) * 0.7);
			const ringCount = Math.min(capacity, count - placed);
			const angleOffset = ring * 0.35;

			for (let i = 0; i < ringCount; i++) {
				const angle =
					(i / ringCount) * Math.PI * 2 - Math.PI / 2 + angleOffset;
				assignments.push({
					lat: centroid.lat + Math.sin(angle) * ringRadius,
					lng:
						centroid.lng +
						Math.cos(angle) * ringRadius * lngCorrection,
					ring,
					artistIndex: placed + i
				});
			}

			placed += ringCount;
			ring++;
		}

		return assignments;
	}

	function getVisibleRings(cameraDist: number): number {
		for (const level of ZOOM_LEVELS) {
			if (cameraDist <= level.maxDist) return level.rings;
		}
		return 1;
	}

	useTask(() => {
		if (!selectedCountry || !geoData || !$camera) {
			setAnchorPos(null);
			setPinScreenPositions([]);
			setHiddenArtistCount(0);
			return;
		}

		const feature = findCountryFeature(geoData, selectedCountry);
		if (!feature) {
			setAnchorPos(null);
			setPinScreenPositions([]);
			setHiddenArtistCount(0);
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
			setHiddenArtistCount(0);
			return;
		}

		const ax = ((projected.x + 1) / 2) * $size.width;
		const ay = (1 - (projected.y + 1) / 2) * $size.height;
		setAnchorPos({ x: ax, y: ay });

		const countryArtists = artists.filter((a) => a.country === selectedCountry);
		const allAssignments = computeRingAssignments(centroid, countryArtists.length);

		// Determine how many rings to show based on camera distance to country
		const camDist = cam.position.distanceTo(worldPos);
		const maxRings = getVisibleRings(camDist);

		const visibleAssignments = allAssignments.filter((a) => a.ring < maxRings);
		const hiddenCount = countryArtists.length - visibleAssignments.length;
		setHiddenArtistCount(hiddenCount);

		// Project visible pins
		const camPos = cam.position;
		const globeCenter = new THREE.Vector3(0, 0, 0);

		// Build a sparse array indexed by artistIndex so overlay can match by index
		const positions = new Array(countryArtists.length).fill(null);

		for (const assignment of visibleAssignments) {
			const pinWorld = latLngToVector3(
				assignment.lat,
				assignment.lng,
				GLOBE_RADIUS + PIN_LIFT
			);
			const pinProjected = pinWorld.clone().project(cam);

			const dirToPin = pinWorld.clone().sub(globeCenter).normalize();
			const dirToCam = camPos.clone().sub(globeCenter).normalize();
			const dot = dirToPin.dot(dirToCam);

			const dist = pinWorld.distanceTo(camPos);
			const refDist = GLOBE_RADIUS + 1.5;
			const scale = Math.max(0.4, Math.min(1.2, refDist / dist));

			const sx = ((pinProjected.x + 1) / 2) * $size.width;
			const sy = (1 - (pinProjected.y + 1) / 2) * $size.height;

			positions[assignment.artistIndex] = {
				x: sx,
				y: sy,
				visible: dot > 0.15 && pinProjected.z <= 1,
				scale,
				ring: assignment.ring
			};
		}

		setPinScreenPositions(positions);
	});
</script>
