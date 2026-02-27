<script lang="ts" module>
	import { computeBorderPositions, processGeoData, type CountryData } from '$lib/utils/globe-geometry';
	import { artists } from '$lib/data/artists';
	import { GLOBE_FILL_RADIUS, GLOBE_BORDER_RADIUS } from '$lib/config';

	// Module-level cache: survives navigation, computed only once per session.
	const countriesWithArtists = new Set(artists.map((a) => a.country));
	let cachedBorderPositions: Float32Array | null = null;
	let cachedCountries: CountryData[] | null = null;
</script>

<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { createQuery } from '@tanstack/svelte-query';
	import { type GeoJSONData } from '$lib/data/geo';
	import { setGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import { GLOBE_RADIUS } from '$lib/config';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
		onGeoDataLoad?: (data: GeoJSONData) => void;
	}

	let { onCountryClick, selectedCountry, onGeoDataLoad }: Props = $props();

	const { camera } = useThrelte();

	const RADIUS = GLOBE_RADIUS;

	function cssVar(name: string): number {
		const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
		return parseInt(hex.replace('#', ''), 16);
	}

	const colorPink = cssVar('--color-pink');
	const highlightPink = cssVar('--color-pink-highlight');
	const colorGlobeDefault = cssVar('--color-globe-default');

	// Initialise from module-level cache if already computed.
	let countries: CountryData[] = $state(cachedCountries ?? []);
	let borderPositions: Float32Array | null = $state(cachedBorderPositions);
	let hoveredCountry: string | null = $state(null);

	const geoQuery = createQuery<GeoJSONData>(() => ({
		queryKey: ['geojson', 'countries'],
		queryFn: () => fetch('/data/ne_110m_countries.geojson').then((r) => r.json()),
	}));

	function getColor(name: string, hasArtists: boolean): number {
		if (name === selectedCountry) return highlightPink;
		if (name === hoveredCountry && hasArtists) return highlightPink;
		if (hasArtists) return colorPink;
		return colorGlobeDefault;
	}

	$effect(() => {
		const data = geoQuery.data;
		if (!data) return;

		onGeoDataLoad?.(data);

		// Already processed on a previous mount — restore from cache instantly.
		if (cachedBorderPositions && cachedCountries) {
			borderPositions = cachedBorderPositions;
			countries = cachedCountries;
			setGlobeLoaded();
			return;
		}

		// First time: compute borders synchronously, then triangulate on next frame.
		cachedBorderPositions = computeBorderPositions(data, GLOBE_BORDER_RADIUS);
		borderPositions = cachedBorderPositions;
		setGlobeLoaded();

		requestAnimationFrame(() => {
			const processed = processGeoData(data, countriesWithArtists, GLOBE_FILL_RADIUS, GLOBE_BORDER_RADIUS);
			cachedCountries = processed.countries;
			countries = cachedCountries;
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
