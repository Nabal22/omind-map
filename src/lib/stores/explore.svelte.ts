import { openArtistDrawer, closeArtistDrawer } from '$lib/stores/artist-drawer.svelte';
import type { Artist } from '$lib/data/artists';

let selectedCountry = $state<string | null>(null);
let focusCountry = $state<string | null>(null);
let justSelectedCountry = false;

export function getSelectedCountry(): string | null {
	return selectedCountry;
}

export function getFocusCountry(): string | null {
	return focusCountry;
}

/** Globe click: set both filter and camera focus */
export function selectCountry(name: string): void {
	selectedCountry = name;
	focusCountry = name;
	closeArtistDrawer();
	justSelectedCountry = true;
	setTimeout(() => (justSelectedCountry = false), 0);
}

/** Filter tag click: set both filter and camera */
export function setCountryFilter(country: string | null): void {
	selectedCountry = country;
	focusCountry = country;
	closeArtistDrawer();
}

/** Artist select: open drawer */
export function selectArtist(artist: Artist): void {
	openArtistDrawer(artist);
}

/** Focus camera on country without changing filter */
export function setFocusCountry(country: string | null): void {
	focusCountry = country;
}

/** Clear all selection */
export function clearSelection(): void {
	if (justSelectedCountry) return;
	resetSelection();
}

/** Force-clear selection (bypasses justSelectedCountry guard) */
export function resetSelection(): void {
	selectedCountry = null;
	focusCountry = null;
	closeArtistDrawer();
}
