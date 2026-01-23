<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import type { Artist } from '$lib/data/artists';
	import { latLngToVector3 } from '$lib/data/artists';

	interface Props {
		artist: Artist;
		onselect: (artist: Artist) => void;
	}

	let { artist, onselect }: Props = $props();

	let position = $derived(latLngToVector3(artist.lat, artist.lng, 2.05));
	let scale = $state(1);
	let time = 0;

	useTask((delta) => {
		time += delta * 3;
		scale = 1 + Math.sin(time) * 0.3;
	});
</script>

<T.Mesh
	position={[position.x, position.y, position.z]}
	scale={[scale, scale, scale]}
	onclick={() => onselect(artist)}
>
	<T.SphereGeometry args={[0.06, 16, 16]} />
	<T.MeshBasicMaterial color="#FFAEF6" />
</T.Mesh>
