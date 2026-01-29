<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { SphereGeometry, BufferGeometry, type Group } from 'three';
	import { buildCountryMeshGeometry, buildCountryOutlineGeometry } from '$lib/data/geo';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		paused?: boolean;
		oncreate?: (group: Group) => void;
	}

	let { children, paused = false, oncreate }: Props = $props();

	let groupRef = $state<Group | undefined>(undefined);
	let countryMeshGeometry = $state<BufferGeometry | undefined>(undefined);
	let countryOutlineGeometry = $state<BufferGeometry | undefined>(undefined);

	$effect(() => {
		if (groupRef && oncreate) {
			oncreate(groupRef);
		}
	});

	$effect(() => {
		fetch('/data/world-110m.geojson')
			.then((res) => res.json())
			.then((geojson) => {
				countryMeshGeometry = buildCountryMeshGeometry(geojson, 2.015, 1);
				countryOutlineGeometry = buildCountryOutlineGeometry(geojson, 2.02);
			});
	});

	interactivity();

	useTask((delta) => {
		if (groupRef && !paused) {
			groupRef.rotation.y += delta * 0.05;
		}
	});
</script>

<T.Group bind:ref={groupRef}>
	<!-- Dark base sphere (ocean) -->
	<T.Mesh>
		<T.SphereGeometry args={[2, 64, 64]} />
		<T.MeshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
	</T.Mesh>

	<!-- Country meshes -->
	{#if countryMeshGeometry}
		<T.Mesh geometry={countryMeshGeometry}>
			<T.MeshStandardMaterial
				color="#2a2a4e"
				roughness={0.6}
				metalness={0.3}
				polygonOffset
				polygonOffsetFactor={-1}
				polygonOffsetUnits={-1}
			/>
		</T.Mesh>
	{/if}

	<!-- Country outlines -->
	{#if countryOutlineGeometry}
		<T.LineSegments geometry={countryOutlineGeometry}>
			<T.LineBasicMaterial color="#FFAEF6" transparent opacity={0.7} />
		</T.LineSegments>
	{/if}

	<!-- Pink wireframe overlay -->
	<T.LineSegments>
		<T.WireframeGeometry args={[new SphereGeometry(2.03, 24, 24)]} />
		<T.LineBasicMaterial color="#FFAEF6" transparent opacity={0.08} />
	</T.LineSegments>

	<!-- Markers (children) -->
	{@render children?.()}
</T.Group>
