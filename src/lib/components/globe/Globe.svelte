<script lang="ts" module>
	import {
		computeBorderPositions,
		processGeoData,
		type CountryData
	} from '$lib/utils/globe-geometry';
	import { artists } from '$lib/data/artists';
	import { GLOBE_FILL_RADIUS, GLOBE_BORDER_RADIUS } from '$lib/config';
	import * as THREE from 'three';

	// Module-level cache: survives navigation, computed only once per session.
	const countriesWithArtists = new Set(artists.map((a) => a.country));
	let cachedBorderPositions: Float32Array | null = null;
	let cachedCountries: CountryData[] | null = null;
	let cachedGrainTexture: THREE.Texture | null = null;

	function getGrainTexture(): THREE.Texture {
		if (!cachedGrainTexture) {
			const size = 1024;
			const data = new Uint8Array(size * size);
			for (let i = 0; i < data.length; i++) {
				const u = Math.random(),
					v = Math.random();
				const gauss = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
				data[i] = Math.max(0, Math.min(255, 128 + gauss * 40));
			}
			const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat);
			tex.wrapS = THREE.RepeatWrapping;
			tex.wrapT = THREE.RepeatWrapping;
			tex.repeat.set(4, 2);
			tex.needsUpdate = true;
			cachedGrainTexture = tex;
		}
		return cachedGrainTexture;
	}

	// Vertex shader: computes spherical UVs from position on the sphere.
	const GRAIN_VERT = /* glsl */ `
		varying vec2 vUv;
		#define PI 3.14159265359
		void main() {
			vec3 n = normalize(position);
			vUv = vec2(
				atan(n.x, n.z) / (2.0 * PI) + 0.5,
				asin(clamp(n.y, -1.0, 1.0)) / PI + 0.5
			);
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	// Border: grain modulates line opacity.
	const BORDER_FRAG = /* glsl */ `
		uniform sampler2D uGrain;
		varying vec2 vUv;
		void main() {
			float grain = texture2D(uGrain, vUv * 4.0).r;
			float alpha = 0.05 + grain * 0.1;
			gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
		}
	`;
</script>

<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { createQuery } from '@tanstack/svelte-query';
	import { type GeoJSONData } from '$lib/data/geo';
	import { setGlobeLoaded } from '$lib/stores/globe-overlay.svelte';
	import { GLOBE_RADIUS } from '$lib/config';
	import { haptic } from '$lib/utils/haptics';

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
		queryFn: () => fetch('/data/ne_110m_countries.geojson').then((r) => r.json())
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
			const processed = processGeoData(
				data,
				countriesWithArtists,
				GLOBE_FILL_RADIUS,
				GLOBE_BORDER_RADIUS
			);
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
			haptic('heavy');
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
	<T.LineSegments
		renderOrder={3}
		frustumCulled={false}
		oncreate={(line) => {
			(line.material as THREE.Material).dispose();
			const mat = new THREE.ShaderMaterial({
				uniforms: { uGrain: { value: getGrainTexture() } },
				vertexShader: GRAIN_VERT,
				fragmentShader: BORDER_FRAG,
				transparent: true
			});
			line.material = mat;
			return () => mat.dispose();
		}}
	>
		<T.BufferGeometry
			oncreate={(geo) => {
				geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			}}
		/>
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
			<!-- Base color — Threlte handles color reactivity natively -->
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
			<!-- Grain overlay — additive, doesn't affect base color -->
			<T.Mesh renderOrder={2} frustumCulled={false}>
				<T.BufferGeometry
					oncreate={(geo) => {
						geo.setAttribute('position', new THREE.BufferAttribute(polygon.vertices, 3));
						geo.setIndex(polygon.indices);
						const pos = polygon.vertices;
						const uvs = new Float32Array((pos.length / 3) * 2);
						for (let j = 0; j < pos.length / 3; j++) {
							const x = pos[j * 3],
								y = pos[j * 3 + 1],
								z = pos[j * 3 + 2];
							const l = Math.sqrt(x * x + y * y + z * z);
							uvs[j * 2] = Math.atan2(x / l, z / l) / (2 * Math.PI) + 0.5;
							uvs[j * 2 + 1] = Math.asin(Math.max(-1, Math.min(1, y / l))) / Math.PI + 0.5;
						}
						geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
					}}
				/>
				<T.MeshBasicMaterial
					side={THREE.DoubleSide}
					oncreate={(mat) => {
						mat.map = getGrainTexture();
						mat.transparent = true;
						mat.opacity = 0.08;
						mat.depthWrite = false;
						mat.blending = THREE.AdditiveBlending;
						mat.needsUpdate = true;
					}}
				/>
			</T.Mesh>
		{/each}
	</T.Group>
{/each}
