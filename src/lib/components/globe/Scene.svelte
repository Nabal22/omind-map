<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { WebGLRenderer } from 'three';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	function createRenderer(canvas: HTMLCanvasElement) {
		const renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance'
		});
		// Cap DPR at 2 — useful for high-DPR phones (3–4) where it cuts fragment work
		// in half with no visible loss. On retina desktop (DPR 2) it's a no-op.
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		return renderer;
	}
</script>

<Canvas {createRenderer}>
	{@render children()}
</Canvas>
