<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import Globe from './Globe.svelte';
	import Marker from './Marker.svelte';
	import { artists, type Artist, latLngToVector3 } from '$lib/data/artists';
	import { Vector3, type PerspectiveCamera, type Group } from 'three';
	import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	interface Props {
		onselect: (artist: Artist) => void;
		targetArtist: Artist | null;
	}

	let { onselect, targetArtist }: Props = $props();

	let cameraRef = $state<PerspectiveCamera | undefined>(undefined);
	let globeGroupRef = $state<Group | undefined>(undefined);
	let controlsInstance: ThreeOrbitControls | null = null;

	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
	const defaultCameraZ = isMobile ? 7 : 5;

	let animating = $state(false);
	let paused = $state(false);

	// Animation state
	let startPos = new Vector3();
	let targetPos = new Vector3();
	let startTarget = new Vector3();
	let endTarget = new Vector3();
	let animProgress = 0;
	const ANIM_DURATION = 0.6; // seconds

	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function zoomToArtist(artist: Artist) {
		if (!cameraRef || !globeGroupRef) return;

		paused = true;
		animating = true;
		animProgress = 0;

		// Get marker world position (accounting for globe rotation)
		const localPos = latLngToVector3(artist.lat, artist.lng, 2.05);
		const worldPos = localPos.clone().applyEuler(globeGroupRef.rotation);

		// Camera target: look at the marker
		endTarget.copy(worldPos);

		// Camera position: offset from marker along the direction from center
		const dir = worldPos.clone().normalize();
		targetPos.copy(worldPos).add(dir.multiplyScalar(1.2));

		// Store current positions
		startPos.copy(cameraRef.position);
		if (controlsInstance) {
			startTarget.copy(controlsInstance.target);
		} else {
			startTarget.set(0, 0, 0);
		}
	}

	function resetCamera() {
		if (!cameraRef) return;

		animating = true;
		animProgress = 0;

		startPos.copy(cameraRef.position);
		targetPos.set(0, 0, defaultCameraZ);

		if (controlsInstance) {
			startTarget.copy(controlsInstance.target);
		}
		endTarget.set(0, 0, 0);
	}

	// React to targetArtist changes
	$effect(() => {
		if (targetArtist) {
			zoomToArtist(targetArtist);
		} else if (cameraRef) {
			resetCamera();
		}
	});

	useTask((delta) => {
		if (!animating || !cameraRef) return;

		animProgress += delta / ANIM_DURATION;

		if (animProgress >= 1) {
			animProgress = 1;
			animating = false;
			if (!targetArtist) {
				paused = false;
			}
		}

		const t = easeOutCubic(Math.min(animProgress, 1));

		cameraRef.position.lerpVectors(startPos, targetPos, t);

		if (controlsInstance) {
			controlsInstance.target.lerpVectors(startTarget, endTarget, t);
			controlsInstance.update();
		}
	});

	$effect(() => {
		if (controlsInstance) {
			controlsInstance.enabled = !animating;
		}
	});

	function handleSelect(artist: Artist) {
		onselect(artist);
	}
</script>

<T.PerspectiveCamera bind:ref={cameraRef} makeDefault position={[0, 0, defaultCameraZ]} fov={60}>
	<OrbitControls
		oncreate={(ref) => {
			controlsInstance = ref;
		}}
		minDistance={3.5}
		maxDistance={isMobile ? 10 : 8}
		enableDamping={true}
		rotateSpeed={1.5}
		dampingFactor={0.15}
		enablePan={false}
		minPolarAngle={0.6}
		maxPolarAngle={2.54}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.7} />
<T.DirectionalLight position={[5, 3, 5]} intensity={1} />
<T.DirectionalLight position={[-3, -1, -3]} intensity={0.3} />

<Globe {paused} oncreate={(group) => (globeGroupRef = group)}>
	{#each artists as artist (artist.id)}
		<Marker {artist} onselect={handleSelect} />
	{/each}
</Globe>
