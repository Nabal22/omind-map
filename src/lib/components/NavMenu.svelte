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
		top: 1.5rem;
		left: 1.5rem;
		z-index: 50;
		font-family: monospace;
	}

	.nav-title {
		font-size: 0.65rem;
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
		gap: 0.2rem;
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
		white-space: nowrap;
	}

	.nav-item:hover {
		border-left-color: #ffaef6;
		text-shadow: 0 0 8px #ffaef6;
		padding-left: 1rem;
	}

	@media (max-width: 640px) {
		.nav-menu {
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 0.75rem 1rem;
			background: rgba(0, 0, 0, 0.85);
			backdrop-filter: blur(8px);
			border-top: 1px solid rgba(255, 174, 246, 0.2);
		}

		.nav-title {
			display: none;
		}

		.nav-list {
			flex-direction: row;
			gap: 0;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}

		.nav-list::-webkit-scrollbar {
			display: none;
		}

		.nav-item {
			font-size: 0.75rem;
			padding: 0.4rem 0.75rem;
			border-left: none;
			border-bottom: 2px solid transparent;
		}

		.nav-item:hover {
			padding-left: 0.75rem;
			border-left: none;
			border-bottom-color: #ffaef6;
		}
	}
</style>
