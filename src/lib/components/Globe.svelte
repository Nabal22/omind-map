<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { loadGeoJSON, type GeoJSONData } from '$lib/data/geo';
	import { processGeoData, type CountryData } from '$lib/utils/globe-geometry';
	import { artists } from '$lib/data/artists';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
		onGeoDataLoad?: (data: GeoJSONData) => void;
	}

	let { onCountryClick, selectedCountry, onGeoDataLoad }: Props = $props();

	const { camera } = useThrelte();

	// Constants
	const RADIUS = 1;
	const FILL_RADIUS = RADIUS * 1.01;
	const BORDER_RADIUS = RADIUS * 1.011;

	// State
	let countries: CountryData[] = $state([]);
	let borderPositions: Float32Array | null = $state(null);
	let hoveredCountry: string | null = $state(null);

	// Derived
	const countriesWithArtists = new Set(artists.map((a) => a.country));

	function getOpacity(name: string, hasArtists: boolean): number {
		if (name === selectedCountry) return 0.6;
		if (name === hoveredCountry && hasArtists) return 0.4;
		if (hasArtists) return 0.15;
		return 0;
	}

	// Load and process GeoJSON
	$effect(() => {
		loadGeoJSON('/data/ne_110m_countries.geojson').then((data) => {
			const processed = processGeoData(data, countriesWithArtists, FILL_RADIUS, BORDER_RADIUS);
			countries = processed.countries;
			borderPositions = processed.borderPositions;
			onGeoDataLoad?.(data);
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

<!-- Globe sphere -->
<T.Mesh renderOrder={0} frustumCulled={false}>
	<T.SphereGeometry args={[RADIUS, 48, 48]} />
	<T.MeshStandardMaterial color="#FFFFFF" roughness={0.9} metalness={0.3} />
</T.Mesh>

<!-- Borders -->
{#if borderPositions}
	{@const positions = borderPositions}
	<T.LineSegments frustumCulled={false}>
		<T.BufferGeometry
			oncreate={(geo) => {
				geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			}}
		/>
		<T.LineBasicMaterial color={0xffffff} transparent opacity={0.3} />
	</T.LineSegments>
{/if}

<!-- Country fills - only countries with artists -->
{#each countries as country (country.name)}
	{@const opacity = getOpacity(country.name, country.hasArtists)}
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
				<T.MeshBasicMaterial color={0xffffff} transparent {opacity} side={THREE.DoubleSide} />
			</T.Mesh>
		{/each}
	</T.Group>
{/each}
