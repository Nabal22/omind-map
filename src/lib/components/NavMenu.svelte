<script lang="ts">
	import { artists, type Artist } from '$lib/data/artists';

	interface Props {
		onselect: (artist: Artist) => void;
	}

	let { onselect }: Props = $props();
</script>

<nav class="nav-menu">
	<h2 class="nav-title">WHERE THE FUCK IS :</h2>
	<ul class="nav-list">
		{#each artists as artist (artist.id)}
			<li>
				<button class="nav-item" onclick={() => onselect(artist)}>
					{artist.name}
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.nav-menu {
		position: fixed;
		top: 2rem;
		left: 2rem;
		z-index: 50;
		font-family: monospace;
	}

	.nav-title {
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		color: #ffaef6;
		opacity: 0.7;
		margin: 0 0 0.75rem;
		text-transform: uppercase;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-item {
		background: none;
		border: none;
		color: #ffaef6;
		font-family: monospace;
		font-size: 0.85rem;
		text-transform: uppercase;
		cursor: pointer;
		padding: 0.3rem 0.5rem;
		text-align: left;
		transition: all 0.15s;
		border-left: 2px solid transparent;
	}

	.nav-item:hover {
		border-left-color: #ffaef6;
		text-shadow: 0 0 8px #ffaef6;
		padding-left: 1rem;
	}
</style>
