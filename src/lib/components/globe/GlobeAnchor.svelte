<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';
	import { findCountryFeature } from '$lib/utils/globe-geometry';
	import { setAnchorPos } from '$lib/stores/globe-overlay.svelte';
	import { GLOBE_RADIUS } from '$lib/config';

	interface Props {
		selectedCountry: string | null;
		geoData: GeoJSONData | null;
	}

	let { selectedCountry, geoData }: Props = $props();

	const { camera, size } = useThrelte();

	useTask(() => {
		if (!selectedCountry || !geoData || !$camera) {
			setAnchorPos(null);
			return;
		}

		const feature = findCountryFeature(geoData, selectedCountry);
		if (!feature) {
			setAnchorPos(null);
			return;
		}

		const centroid = getCountryCentroid(feature);
		const cam = $camera as THREE.PerspectiveCamera;

		const worldPos = latLngToVector3(centroid.lat, centroid.lng, GLOBE_RADIUS);
		const projected = worldPos.clone().project(cam);

		if (projected.z > 1) {
			setAnchorPos(null);
			return;
		}

		const x = ((projected.x + 1) / 2) * $size.width;
		const y = (1 - (projected.y + 1) / 2) * $size.height;
		setAnchorPos({ x, y });
	});
</script>
