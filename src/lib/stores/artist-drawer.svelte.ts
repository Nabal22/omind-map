import type { Artist } from '$lib/data/artists';

let selectedArtist = $state<Artist | null>(null);

export function openArtistDrawer(artist: Artist) {
	selectedArtist = artist;
}

export function closeArtistDrawer() {
	selectedArtist = null;
}

export function getSelectedArtist(): Artist | null {
	return selectedArtist;
}
