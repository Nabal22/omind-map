<script lang="ts">
	import type { Artist } from '$lib/data/artists';

	interface Props {
		artist: Artist;
		onclose: () => void;
	}

	let { artist, onclose }: Props = $props();
</script>

<div class="popup-overlay" role="dialog" aria-modal="true">
	<div class="popup">
		<button class="close-btn" onclick={onclose}>[X]</button>
		<p class="popup-subtitle">WHERE THE FUCK IS</p>
		<h2 class="popup-title">{artist.name}</h2>
		<div class="popup-info">
			<p><span class="label">COUNTRY:</span> {artist.country}</p>
			<p><span class="label">BIO:</span> {artist.description}</p>
		</div>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
		<a class="music-link" href={artist.musicUrl} target="_blank" rel="noopener noreferrer">
			[ LISTEN → ]
		</a>
	</div>
</div>

<style>
	.popup-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		pointer-events: none;
		padding: 1rem;
	}

	.popup {
		pointer-events: all;
		background: #000;
		border: 2px solid #ffaef6;
		padding: 2rem;
		max-width: 400px;
		width: 100%;
		font-family: monospace;
		color: #ffaef6;
		position: relative;
		box-shadow:
			0 0 20px rgba(255, 174, 246, 0.3),
			inset 0 0 20px rgba(255, 174, 246, 0.05);
		animation: glitch-in 0.3s ease-out;
	}

	.popup::before {
		content: '';
		position: absolute;
		inset: -4px;
		border: 1px solid #ffaef6;
		opacity: 0.4;
		pointer-events: none;
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		color: #ffaef6;
		font-family: monospace;
		font-size: 1rem;
		cursor: pointer;
		padding: 0.5rem;
		z-index: 10;
	}

	.close-btn:hover {
		text-shadow: 0 0 8px #ffaef6;
	}

	.popup-subtitle {
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		margin: 0 0 0.25rem;
		opacity: 0.7;
	}

	.popup-title {
		font-size: 1.8rem;
		margin: 0 0 1.5rem;
		text-transform: uppercase;
		text-shadow: 0 0 10px #ffaef6;
	}

	.popup-info {
		margin-bottom: 1.5rem;
	}

	.popup-info p {
		margin: 0.5rem 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.label {
		opacity: 0.6;
	}

	.music-link {
		display: inline-block;
		color: #ffaef6;
		text-decoration: none;
		font-size: 0.9rem;
		border: 1px solid #ffaef6;
		padding: 0.5rem 1rem;
		transition: all 0.2s;
	}

	.music-link:hover {
		background: #ffaef6;
		color: #000;
		box-shadow: 0 0 15px #ffaef6;
	}

	@media (max-width: 640px) {
		.popup-overlay {
			align-items: flex-end;
			padding: 0;
			padding-bottom: 3.5rem;
		}

		.popup {
			padding: 1.5rem;
			border-bottom: none;
			border-left: none;
			border-right: none;
			max-width: none;
			width: 100%;
			animation: slide-up 0.25s ease-out;
		}

		.popup::before {
			display: none;
		}

		.popup-title {
			font-size: 1.4rem;
			margin-bottom: 1rem;
		}

		.popup-info p {
			font-size: 0.8rem;
		}
	}

	@keyframes glitch-in {
		0% {
			opacity: 0;
			transform: translateX(-5px) skewX(-2deg);
		}
		50% {
			transform: translateX(3px) skewX(1deg);
		}
		100% {
			opacity: 1;
			transform: translateX(0) skewX(0);
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
