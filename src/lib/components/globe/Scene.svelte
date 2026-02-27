<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<Canvas>
	{@render children()}
</Canvas>
