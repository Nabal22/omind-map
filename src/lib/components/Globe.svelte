<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import earcut from 'earcut';
	import { loadGeoJSON, getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';
	import { artists } from '$lib/data/artists';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
	}

	let { onCountryClick, selectedCountry }: Props = $props();

	const { camera } = useThrelte();
	interactivity();

	interface CountryData {
		name: string;
		hasArtists: boolean;
		polygons: { vertices: Float32Array; indices: number[] }[];
	}

	interface BorderData {
		positions: Float32Array;
	}

	let geoData: GeoJSONData | null = $state(null);
	let countries: CountryData[] = $state([]);
	let borderData: BorderData | null = $state(null);
	let hoveredCountry: string | null = $state(null);

	let targetCameraPosition = $state<THREE.Vector3 | null>(null);
	let targetLookAt = $state<THREE.Vector3 | null>(null);
	let isAnimating = $state(false);

	const RADIUS = 1;
	const CAMERA_DISTANCE = 2.5;
	const ZOOM_DISTANCE = 1.8;

	const countriesWithArtists = new Set(artists.map((a) => a.country));

	function getOpacity(countryName: string, hasArtists: boolean): number {
		if (countryName === selectedCountry) return 0.8;
		if (countryName === hoveredCountry && hasArtists) return 0.7;
		if (hasArtists) return 0.5;
		return 0;
	}

	function processPolygon(
		outerRing: number[][],
		radius: number
	): { vertices: Float32Array; indices: number[] } | null {
		if (outerRing.length < 3) return null;

		const flatVertices: number[] = [];
		const vertices: number[] = [];

		for (const coord of outerRing) {
			const [lng, lat] = coord;
			flatVertices.push(lng, lat);
			const vec = latLngToVector3(lat, lng, radius);
			vertices.push(vec.x, vec.y, vec.z);
		}

		try {
			const indices = earcut(flatVertices, undefined, 2);
			if (indices.length === 0) return null;

			return {
				vertices: new Float32Array(vertices),
				indices
			};
		} catch {
			return null;
		}
	}

	$effect(() => {
		loadGeoJSON('/data/ne_110m_countries.geojson').then((data) => {
			geoData = data;

			const processedCountries: CountryData[] = [];
			const borderPositions: number[] = [];

			for (const feature of data.features) {
				const countryName = feature.properties.NAME;
				const hasArtists = countriesWithArtists.has(countryName);
				const geometry = feature.geometry;
				const rawPolygons =
					geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];

				const countryPolygons: { vertices: Float32Array; indices: number[] }[] = [];

				for (const polygon of rawPolygons) {
					const outerRing = (polygon as number[][][])[0];
					if (!outerRing || outerRing.length < 3) continue;

					const processed = processPolygon(outerRing, RADIUS * 1.01);
					if (processed) {
						countryPolygons.push(processed);
					}

					// Border lines
					for (let i = 0; i < outerRing.length - 1; i++) {
						const [lng1, lat1] = outerRing[i];
						const [lng2, lat2] = outerRing[i + 1];
						const v1 = latLngToVector3(lat1, lng1, RADIUS * 1.011);
						const v2 = latLngToVector3(lat2, lng2, RADIUS * 1.011);
						borderPositions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
					}
				}

				if (countryPolygons.length > 0) {
					processedCountries.push({
						name: countryName,
						hasArtists,
						polygons: countryPolygons
					});
				}

			}

			countries = processedCountries;
			borderData = { positions: new Float32Array(borderPositions) };
		});
	});

	$effect(() => {
		if (selectedCountry && geoData) {
			const feature = geoData.features.find((f) => f.properties.NAME === selectedCountry);
			if (feature) {
				const centroid = getCountryCentroid(feature);
				const targetPos = latLngToVector3(centroid.lat, centroid.lng, ZOOM_DISTANCE);
				const lookAtPos = latLngToVector3(centroid.lat, centroid.lng, 0);

				targetCameraPosition = targetPos;
				targetLookAt = lookAtPos;
				isAnimating = true;
			}
		}
	});

	useTask((delta) => {
		if (isAnimating && targetCameraPosition && targetLookAt && $camera) {
			const cam = $camera as THREE.PerspectiveCamera;
			const speed = 5;

			cam.position.lerp(targetCameraPosition, delta * speed);
			cam.lookAt(targetLookAt);

			if (cam.position.distanceTo(targetCameraPosition) < 0.01) {
				isAnimating = false;
			}
		}
	});

	function handleCountryClick(countryName: string) {
		if (countriesWithArtists.has(countryName)) {
			onCountryClick(countryName);
		}
	}

	function handleCountryHover(countryName: string | null) {
		hoveredCountry = countryName;
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, CAMERA_DISTANCE]} fov={45}>
	<OrbitControls
		enableDamping
		dampingFactor={0.05}
		enableZoom
		minDistance={1.5}
		maxDistance={5}
		enablePan={false}
		autoRotate={!selectedCountry && !isAnimating}
		autoRotateSpeed={0.3}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 3, 5]} intensity={1} />

<!-- Globe sphere -->
<T.Mesh>
	<T.SphereGeometry args={[RADIUS, 64, 64]} />
	<T.MeshBasicMaterial color={0x0a0a0a} />
</T.Mesh>

<!-- Country borders -->
{#if borderData}
	{@const positions = borderData.positions}
	<T.LineSegments>
		<T.BufferGeometry
			oncreate={(geo) => {
				geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			}}
		/>
		<T.LineBasicMaterial color={0xffaef6} transparent opacity={0.6} />
	</T.LineSegments>
{/if}

<!-- Country fills -->
{#each countries as country (country.name)}
	{@const opacity = getOpacity(country.name, country.hasArtists)}
	<T.Group
		onclick={() => handleCountryClick(country.name)}
		onpointerenter={() => handleCountryHover(country.name)}
		onpointerleave={() => handleCountryHover(null)}
	>
		{#each country.polygons as polygon, i (i)}
			<T.Mesh>
				<T.BufferGeometry
					oncreate={(geo) => {
						geo.setAttribute('position', new THREE.BufferAttribute(polygon.vertices, 3));
						geo.setIndex(polygon.indices);
						geo.computeVertexNormals();
					}}
				/>
				<T.MeshBasicMaterial color={0xffaef6} transparent {opacity} side={THREE.DoubleSide} />
			</T.Mesh>
		{/each}
	</T.Group>
{/each}

