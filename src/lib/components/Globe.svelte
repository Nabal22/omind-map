<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { SphereGeometry, BufferGeometry, Float32BufferAttribute, type Group } from 'three';
	import { continentOutlines } from '$lib/data/continents';
	import { latLngToVector3 } from '$lib/data/artists';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		paused?: boolean;
		groupRef?: Group | undefined;
	}

	let { children, paused = false, groupRef = $bindable() }: Props = $props();

	interactivity();

	useTask((delta) => {
		if (groupRef && !paused) {
			groupRef.rotation.y += delta * 0.05;
		}
	});

	function createContinentGeometry(coords: [number, number][]): BufferGeometry {
		const points: number[] = [];
		for (const [lat, lng] of coords) {
			const v = latLngToVector3(lat, lng, 2.01);
			points.push(v.x, v.y, v.z);
		}
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
		return geometry;
	}

	const continentGeometries = continentOutlines.map(createContinentGeometry);
</script>

<T.Group bind:ref={groupRef}>
	<!-- Dark base sphere -->
	<T.Mesh>
		<T.SphereGeometry args={[2, 64, 64]} />
		<T.MeshStandardMaterial color="#1a1a2e" roughness={0.7} metalness={0.3} />
	</T.Mesh>

	<!-- Pink wireframe overlay -->
	<T.LineSegments>
		<T.WireframeGeometry args={[new SphereGeometry(2.02, 24, 24)]} />
		<T.LineBasicMaterial color="#FFAEF6" transparent opacity={0.1} />
	</T.LineSegments>

	<!-- Continent outlines -->
	{#each continentGeometries as geometry, i (i)}
		<T.Line {geometry}>
			<T.LineBasicMaterial color="#FFAEF6" transparent opacity={0.7} />
		</T.Line>
	{/each}

	<!-- Markers (children) -->
	{@render children?.()}
</T.Group>
