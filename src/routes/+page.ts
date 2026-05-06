import { artists } from '$lib/data/artists';

export const prerender = true;

export const load = () => {
	const countries = Array.from(new Set(artists.map((a) => a.country))).sort();
	return { artists, countries };
};
