<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { SphereGeometry, BufferGeometry, type Group } from 'three';
	import { buildCountryGeometries } from '$lib/data/geo';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		paused?: boolean;
		oncreate?: (group: Group) => void;
	}

	let { children, paused = false, oncreate }: Props = $props();

	let groupRef = $state<Group | undefined>(undefined);
	let countryGeometries = $state<BufferGeometry[]>([]);

	$effect(() => {
		if (groupRef && oncreate) {
			oncreate(groupRef);
		}
	});

	$effect(() => {
		// Based on https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
		fetch('/data/world-110m.geojson')
			.then((res) => res.json())
			.then((geojson) => {
				countryGeometries = buildCountryGeometries(geojson);
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

	<!-- Country outlines -->
	{#each countryGeometries as geometry, i (i)}
		<T.LineLoop {geometry}>
			<T.LineBasicMaterial color="#FFAEF6" transparent opacity={0.7} />
		</T.LineLoop>
	{/each}

	<!-- Markers (children) -->
	{@render children?.()}
</T.Group>
