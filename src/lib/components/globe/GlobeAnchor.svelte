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
	import { computeRingAssignments, getVisibleRings } from '$lib/utils/pin-layout';
	import { GLOBE_RADIUS, PIN_LIFT } from '$lib/config';

	interface Props {
		selectedCountry: string | null;
		geoData: GeoJSONData | null;
	}

	let { selectedCountry, geoData }: Props = $props();

	const { camera, size } = useThrelte();

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

		const camDist = cam.position.distanceTo(worldPos);
		const maxRings = getVisibleRings(camDist);

		const visibleAssignments = allAssignments.filter((a) => a.ring < maxRings);
		setHiddenArtistCount(countryArtists.length - visibleAssignments.length);

		const camPos = cam.position;
		const globeCenter = new THREE.Vector3(0, 0, 0);
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
