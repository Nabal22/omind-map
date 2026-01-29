<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import earcut from 'earcut';
	import {
		loadGeoJSON,
		getCountryCentroid,
		latLngToVector3,
		type GeoJSONData
	} from '$lib/data/geo';
	import { artists } from '$lib/data/artists';

	interface Props {
		onCountryClick: (countryName: string) => void;
		selectedCountry: string | null;
	}

	let { onCountryClick, selectedCountry }: Props = $props();

	const { camera } = useThrelte();
	interactivity();

	// Constants
	const RADIUS = 1;
	const FILL_RADIUS = RADIUS * 1.01;
	const BORDER_RADIUS = RADIUS * 1.011;
	const CAMERA_DISTANCE = 2.5;
	const ZOOM_DISTANCE = 1.8;

	// State
	let geoData: GeoJSONData | null = $state(null);
	let countries: CountryData[] = $state([]);
	let borderPositions: Float32Array | null = $state(null);
	let hoveredCountry: string | null = $state(null);
	let targetCameraPosition = $state<THREE.Vector3 | null>(null);
	let targetLookAt = $state<THREE.Vector3 | null>(null);
	let isAnimating = $state(false);

	// Types
	interface CountryData {
		name: string;
		hasArtists: boolean;
		polygons: { vertices: Float32Array; indices: number[] }[];
	}

	// Derived
	const countriesWithArtists = new Set(artists.map((a) => a.country));

	function getOpacity(name: string, hasArtists: boolean): number {
		if (name === selectedCountry) return 0.8;
		if (name === hoveredCountry && hasArtists) return 0.7;
		if (hasArtists) return 0.5;
		return 0;
	}

	// Unwrap longitudes to avoid dateline jumps (e.g., Russia/USA/China)
	function unwrapRing(ring: number[][]): number[][] {
		if (ring.length === 0) return ring;

		const unwrapped: number[][] = [ring[0]];
		let prevLng = ring[0][0];

		for (let i = 1; i < ring.length; i++) {
			let [lng, lat] = ring[i];
			let diff = lng - prevLng;
			if (diff > 180) lng -= 360;
			else if (diff < -180) lng += 360;

			unwrapped.push([lng, lat]);
			prevLng = lng;
		}

		return unwrapped;
	}

	// Subdivide in lat/lng space then project to sphere
	function subdivideTriangleLatLng(
		lat1: number, lng1: number,
		lat2: number, lng2: number,
		lat3: number, lng3: number,
		radius: number,
		maxAngle: number,
		vertices: number[],
		indices: number[]
	): void {
		// Calculate angular distances
		const dLat12 = Math.abs(lat1 - lat2);
		const dLng12 = Math.abs(lng1 - lng2);
		const dLat23 = Math.abs(lat2 - lat3);
		const dLng23 = Math.abs(lng2 - lng3);
		const dLat31 = Math.abs(lat3 - lat1);
		const dLng31 = Math.abs(lng3 - lng1);
		
		const d1 = Math.max(dLat12, dLng12);
		const d2 = Math.max(dLat23, dLng23);
		const d3 = Math.max(dLat31, dLng31);
		const maxDist = Math.max(d1, d2, d3);

		if (maxDist <= maxAngle) {
			// Triangle is small enough, project and add it
			const p1 = latLngToVector3(lat1, lng1, radius);
			const p2 = latLngToVector3(lat2, lng2, radius);
			const p3 = latLngToVector3(lat3, lng3, radius);
			
			const baseIndex = vertices.length / 3;
			vertices.push(p1.x, p1.y, p1.z);
			vertices.push(p2.x, p2.y, p2.z);
			vertices.push(p3.x, p3.y, p3.z);
			indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
		} else {
			// Subdivide by splitting the longest edge in lat/lng space
			if (d1 >= d2 && d1 >= d3) {
				const midLat = (lat1 + lat2) / 2;
				const midLng = (lng1 + lng2) / 2;
				subdivideTriangleLatLng(lat1, lng1, midLat, midLng, lat3, lng3, radius, maxAngle, vertices, indices);
				subdivideTriangleLatLng(midLat, midLng, lat2, lng2, lat3, lng3, radius, maxAngle, vertices, indices);
			} else if (d2 >= d1 && d2 >= d3) {
				const midLat = (lat2 + lat3) / 2;
				const midLng = (lng2 + lng3) / 2;
				subdivideTriangleLatLng(lat1, lng1, lat2, lng2, midLat, midLng, radius, maxAngle, vertices, indices);
				subdivideTriangleLatLng(lat1, lng1, midLat, midLng, lat3, lng3, radius, maxAngle, vertices, indices);
			} else {
				const midLat = (lat3 + lat1) / 2;
				const midLng = (lng3 + lng1) / 2;
				subdivideTriangleLatLng(lat1, lng1, lat2, lng2, midLat, midLng, radius, maxAngle, vertices, indices);
				subdivideTriangleLatLng(midLat, midLng, lat2, lng2, lat3, lng3, radius, maxAngle, vertices, indices);
			}
		}
	}

	function triangulatePolygon(
		ring: number[][],
		radius: number
	): { vertices: Float32Array; indices: number[] } | null {
		if (ring.length < 3) return null;

		const flat: number[] = [];
		const coords: { lat: number; lng: number }[] = [];
		const unwrappedRing = unwrapRing(ring);

		for (const [lng, lat] of unwrappedRing) {
			flat.push(lng, lat);
			coords.push({ lat, lng });
		}

		try {
			const originalIndices = earcut(flat, undefined, 2);
			if (originalIndices.length === 0) return null;

			const subdivided: number[] = [];
			const subdividedIndices: number[] = [];
			const maxAngle = 10; // Max 10 degrees per triangle edge

			for (let i = 0; i < originalIndices.length; i += 3) {
				const c1 = coords[originalIndices[i]];
				const c2 = coords[originalIndices[i + 1]];
				const c3 = coords[originalIndices[i + 2]];
				
				subdivideTriangleLatLng(
					c1.lat, c1.lng,
					c2.lat, c2.lng,
					c3.lat, c3.lng,
					radius, maxAngle, subdivided, subdividedIndices
				);
			}

			if (subdividedIndices.length === 0) return null;
			return { vertices: new Float32Array(subdivided), indices: subdividedIndices };
		} catch {
			return null;
		}
	}

	// Load GeoJSON and process countries
	$effect(() => {
		loadGeoJSON('/data/ne_110m_countries.geojson').then((data) => {
			geoData = data;

			const processedCountries: CountryData[] = [];
			const borders: number[] = [];

			for (const feature of data.features) {
				const name = feature.properties.NAME;
				const hasArtists = countriesWithArtists.has(name);
				const rawPolygons =
					feature.geometry.type === 'MultiPolygon'
						? feature.geometry.coordinates
						: [feature.geometry.coordinates];

				const polygons: { vertices: Float32Array; indices: number[] }[] = [];

				for (const polygon of rawPolygons) {
					const ring = (polygon as number[][][])[0];
					if (!ring || ring.length < 3) continue;

					const triangulated = triangulatePolygon(ring, FILL_RADIUS);
					if (triangulated) polygons.push(triangulated);

					// Build border lines
					for (let i = 0; i < ring.length - 1; i++) {
						const [lng1, lat1] = ring[i];
						const [lng2, lat2] = ring[i + 1];
						const v1 = latLngToVector3(lat1, lng1, BORDER_RADIUS);
						const v2 = latLngToVector3(lat2, lng2, BORDER_RADIUS);
						borders.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
					}
				}

				if (polygons.length > 0) {
					processedCountries.push({ name, hasArtists, polygons });
				}
			}

			countries = processedCountries;
			borderPositions = new Float32Array(borders);
		});
	});

	// Camera animation on country select
	$effect(() => {
		if (selectedCountry && geoData) {
			const feature = geoData.features.find((f) => f.properties.NAME === selectedCountry);
			if (feature) {
				const centroid = getCountryCentroid(feature);
				targetCameraPosition = latLngToVector3(centroid.lat, centroid.lng, ZOOM_DISTANCE);
				targetLookAt = latLngToVector3(centroid.lat, centroid.lng, 0);
				isAnimating = true;
			}
		}
	});

	// Animate camera
	useTask((delta) => {
		if (isAnimating && targetCameraPosition && targetLookAt && $camera) {
			const cam = $camera as THREE.PerspectiveCamera;
			cam.position.lerp(targetCameraPosition, delta * 5);
			cam.lookAt(targetLookAt);

			if (cam.position.distanceTo(targetCameraPosition) < 0.01) {
				isAnimating = false;
			}
		}
	});

	interface PointerEventLike {
		face?: { normal: THREE.Vector3 };
		object?: THREE.Object3D;
		point?: THREE.Vector3;
	}

	function isFrontFace(event: PointerEventLike): boolean {
		if (!event?.face || !event?.object || !$camera) return false;
		const normal = event.face.normal.clone().transformDirection(event.object.matrixWorld);
		const toCamera = (event.point as THREE.Vector3)
			.clone()
			.sub(($camera as THREE.PerspectiveCamera).position)
			.normalize();
		return normal.dot(toCamera) < 0;
	}

	function handleClick(name: string, event: PointerEventLike) {
		if (!isFrontFace(event)) return;
		if (countriesWithArtists.has(name)) onCountryClick(name);
	}

	function handleHover(name: string | null) {
		hoveredCountry = name;
	}
</script>

<!-- Camera -->
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

<!-- Lighting -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 3, 5]} intensity={1} />

<!-- Globe -->
<T.Mesh renderOrder={0}>
	<T.SphereGeometry args={[RADIUS, 64, 64]} />
	<T.MeshStandardMaterial color="#1a1a2e" roughness={0.7} metalness={0.8} />
</T.Mesh>

<!-- Borders -->
{#if borderPositions}
	{@const positions = borderPositions}
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
		onclick={(event : PointerEventLike) => handleClick(country.name, event)}
		onpointerenter={() => handleHover(country.name)}
		onpointerleave={() => handleHover(null)}
	>
		{#each country.polygons as polygon, i (i)}
			<T.Mesh renderOrder={2}>
				<T.BufferGeometry
					oncreate={(geo) => {
						geo.setAttribute('position', new THREE.BufferAttribute(polygon.vertices, 3));
						geo.setIndex(polygon.indices);
						geo.computeVertexNormals();
					}}
				/>
				<T.MeshBasicMaterial
					color={0xffaef6}
					transparent
					{opacity}
					side={THREE.DoubleSide}
					depthWrite={false}
					polygonOffset
					polygonOffsetFactor={-1}
					polygonOffsetUnits={-1}
				/>
			</T.Mesh>
		{/each}
	</T.Group>
{/each}
