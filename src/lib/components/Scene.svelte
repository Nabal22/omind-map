<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SceneContent from './SceneContent.svelte';
	import type { Artist } from '$lib/data/artists';

	interface Props {
		onselect: (artist: Artist) => void;
		targetArtist: Artist | null;
	}

	let { onselect, targetArtist }: Props = $props();
</script>

<Canvas>
	<SceneContent {onselect} {targetArtist} />
</Canvas>
