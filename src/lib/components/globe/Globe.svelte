<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { loadGeoJSON, type GeoJSONData } from '$lib/data/geo';
	import {
		computeBorderPositions,
		processGeoData,
		type CountryData
	} from '$lib/utils/globe-geometry';
	import { artists } from '$lib/data/artists';
	import { setGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import { GLOBE_RADIUS, GLOBE_FILL_RADIUS, GLOBE_BORDER_RADIUS, COLORS } from '$lib/config';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
		onGeoDataLoad?: (data: GeoJSONData) => void;
	}

	let { onCountryClick, selectedCountry, onGeoDataLoad }: Props = $props();

	const { camera } = useThrelte();

	const RADIUS = GLOBE_RADIUS;
	const FILL_RADIUS = GLOBE_FILL_RADIUS;
	const BORDER_RADIUS = GLOBE_BORDER_RADIUS;

	// State
	let countries: CountryData[] = $state([]);
	let borderPositions: Float32Array | null = $state(null);
	let hoveredCountry: string | null = $state(null);

	// Derived
	const countriesWithArtists = new Set(artists.map((a) => a.country));

	function getColor(name: string, hasArtists: boolean): number {
		if (name === selectedCountry) return COLORS.selected;
		if (name === hoveredCountry && hasArtists) return COLORS.hoveredWithArtists;
		if (hasArtists) return COLORS.hasArtists;
		return COLORS.defaultCountry;
	}

	// Load and process GeoJSON in two phases so the browser renders borders
	// before the heavier country triangulation blocks the frame.
	$effect(() => {
		loadGeoJSON('/data/ne_110m_countries.geojson').then((data) => {
			// Phase 1 (synchronous, ~0 ms): border lines appear on the next frame.
			borderPositions = computeBorderPositions(data, BORDER_RADIUS);
			onGeoDataLoad?.(data);
			setGlobeLoaded();

			// Phase 2 (deferred): triangulate country fills after the browser
			// has had a chance to render the wireframe globe.
			requestAnimationFrame(() => {
				const processed = processGeoData(data, countriesWithArtists, FILL_RADIUS, BORDER_RADIUS);
				countries = processed.countries;
			});
		});
	});

	interface GlobePointerEvent {
		face?: { normal: THREE.Vector3 };
		object?: THREE.Object3D;
		point?: THREE.Vector3;
	}

	function isFrontFace(event: GlobePointerEvent): boolean {
		if (!event?.face || !event?.object || !event?.point || !$camera) return false;
		const normal = event.face.normal.clone().transformDirection(event.object.matrixWorld);
		const toCamera = event.point
			.clone()
			.sub(($camera as THREE.PerspectiveCamera).position)
			.normalize();
		return normal.dot(toCamera) < 0;
	}

	function handleClick(name: string, event: GlobePointerEvent) {
		if (isFrontFace(event) && countriesWithArtists.has(name)) {
			onCountryClick(name);
		}
	}

	function handlePointerEnter(name: string) {
		hoveredCountry = name;
		if (countriesWithArtists.has(name)) {
			document.body.style.cursor = 'pointer';
		}
	}

	function handlePointerLeave() {
		hoveredCountry = null;
		document.body.style.cursor = 'auto';
	}

	// Cleanup cursor on unmount
	$effect(() => {
		return () => {
			document.body.style.cursor = 'auto';
		};
	});
</script>

<!-- Globe sphere (same color as background = invisible ocean) -->
<T.Mesh renderOrder={0} frustumCulled={false}>
	<T.SphereGeometry args={[RADIUS, 48, 48]} />
	<T.MeshBasicMaterial transparent opacity={0.98} />
</T.Mesh>

<!-- Borders -->
{#if borderPositions}
	{@const positions = borderPositions}
	<T.LineSegments renderOrder={3} frustumCulled={false}>
		<T.BufferGeometry
			oncreate={(geo) => {
				geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			}}
		/>
		<T.LineBasicMaterial color={0xffffff} opacity={0.1} />
	</T.LineSegments>
{/if}

<!-- Country fills - all countries -->
{#each countries as country (country.name)}
	{@const color = getColor(country.name, country.hasArtists)}
	<T.Group
		onclick={(event: GlobePointerEvent) => handleClick(country.name, event)}
		onpointerenter={() => handlePointerEnter(country.name)}
		onpointerleave={handlePointerLeave}
	>
		{#each country.polygons as polygon, i (i)}
			<T.Mesh renderOrder={2} frustumCulled={false}>
				<T.BufferGeometry
					oncreate={(geo) => {
						geo.setAttribute('position', new THREE.BufferAttribute(polygon.vertices, 3));
						geo.setIndex(polygon.indices);
						geo.computeVertexNormals();
					}}
				/>
				<T.MeshBasicMaterial {color} side={THREE.DoubleSide} />
			</T.Mesh>
		{/each}
	</T.Group>
{/each}
