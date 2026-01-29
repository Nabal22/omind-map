<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import { loadGeoJSON, getCountryCentroid, latLngToVector3, type GeoJSONData } from '$lib/data/geo';
	import { processGeoData, findCountryFeature, type CountryData } from '$lib/utils/globe-geometry';
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
	let cameraTarget = $state<{ position: THREE.Vector3; lookAt: THREE.Vector3 } | null>(null);

	// Derived
	const countriesWithArtists = new Set(artists.map((a) => a.country));

	function getOpacity(name: string, hasArtists: boolean): number {
		if (name === selectedCountry) return 0.8;
		if (name === hoveredCountry && hasArtists) return 0.7;
		if (hasArtists) return 0.5;
		return 0;
	}

	// Load and process GeoJSON
	$effect(() => {
		loadGeoJSON('/data/ne_110m_countries.geojson').then((data) => {
			geoData = data;
			const processed = processGeoData(data, countriesWithArtists, FILL_RADIUS, BORDER_RADIUS);
			countries = processed.countries;
			borderPositions = processed.borderPositions;
		});
	});

	// Set camera target on country select
	$effect(() => {
		if (selectedCountry && geoData) {
			const feature = findCountryFeature(geoData, selectedCountry);
			if (feature) {
				const centroid = getCountryCentroid(feature);
				cameraTarget = {
					position: latLngToVector3(centroid.lat, centroid.lng, ZOOM_DISTANCE),
					lookAt: latLngToVector3(centroid.lat, centroid.lng, 0)
				};
			}
		}
	});

	// Zoom out when deselecting country
	let prevSelectedCountry: string | null = null;
	$effect(() => {
		if (prevSelectedCountry && !selectedCountry && $camera) {
			// Zoom out along current camera direction
			const cam = $camera as THREE.PerspectiveCamera;
			const direction = cam.position.clone().normalize();
			cameraTarget = {
				position: direction.multiplyScalar(CAMERA_DISTANCE),
				lookAt: new THREE.Vector3(0, 0, 0)
			};
		}
		prevSelectedCountry = selectedCountry;
	});

	// Animate camera
	useTask((delta) => {
		if (!cameraTarget || !$camera) return;
		const cam = $camera as THREE.PerspectiveCamera;
		cam.position.lerp(cameraTarget.position, delta * 5);
		cam.lookAt(cameraTarget.lookAt);
		if (cam.position.distanceTo(cameraTarget.position) < 0.01) cameraTarget = null;
	});

	interface GlobePointerEvent {
		face?: { normal: THREE.Vector3 };
		object?: THREE.Object3D;
		point?: THREE.Vector3;
	}

	function isFrontFace(event: GlobePointerEvent): boolean {
		if (!event?.face || !event?.object || !event?.point || !$camera) return false;
		const normal = event.face.normal.clone().transformDirection(event.object.matrixWorld);
		const toCamera = event.point.clone().sub(($camera as THREE.PerspectiveCamera).position).normalize();
		return normal.dot(toCamera) < 0;
	}

	function handleClick(name: string, event: GlobePointerEvent) {
		if (isFrontFace(event) && countriesWithArtists.has(name)) {
			onCountryClick(name);
		}
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
		autoRotate={!selectedCountry && !cameraTarget}
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
		onclick={(event: GlobePointerEvent) => handleClick(country.name, event)}
		onpointerenter={() => (hoveredCountry = country.name)}
		onpointerleave={() => (hoveredCountry = null)}
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
				/>
			</T.Mesh>
		{/each}
	</T.Group>
{/each}
