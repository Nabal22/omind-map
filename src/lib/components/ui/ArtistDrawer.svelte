<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getSelectedArtist, closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
	import { haptic } from '$lib/utils/haptics';
	import ArtistDetails from './ArtistDetails.svelte';

	interface Props {
		onClose?: () => void;
	}

	let { onClose = closeArtistDrawer }: Props = $props();

	let artist = $derived(getSelectedArtist());
	let open = $derived(!!artist);

	// Snapshot the last artist so content stays visible while animating out
	let displayArtist = $state(getSelectedArtist());
	$effect(() => {
		if (artist) displayArtist = artist;
	});

	let mounted = $state(false);
	$effect(() => {
		if (open) {
			mounted = true;
		} else {
			const t = setTimeout(() => {
				mounted = false;
				displayArtist = null;
			}, 200);
			return () => clearTimeout(t);
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && artist) onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mounted}
	<!-- Desktop: top-left card. Mobile sheet is handled by MobileSheet. -->
	<div
		class="fixed top-6 left-6 z-[71] hidden max-w-sm touch-manipulation border border-black/10 bg-white font-mono text-black sm:block"
		style="opacity: {open ? 1 : 0}; transition: opacity 150ms ease;"
		role="dialog"
		tabindex="-1"
		transition:fade={{ duration: 150 }}
	>
		<button
			class="absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent text-black/30 transition-colors duration-150 hover:text-black/60"
			onclick={() => {
				haptic('light');
				onClose();
			}}
			aria-label="Close"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
			>
		</button>

		{#if displayArtist}
			<div class="max-h-[80vh] overflow-y-auto px-4 pt-4 pb-6">
				<ArtistDetails artist={displayArtist} />
			</div>
		{/if}
	</div>
{/if}
