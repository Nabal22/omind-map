import { error } from '@sveltejs/kit';
import { playlists } from '$lib/data/playlists';

export const prerender = true;

export const entries = () => playlists.map((p) => ({ slug: p.slug }));

export const load = ({ params }) => {
	const playlist = playlists.find((p) => p.slug === params.slug);
	if (!playlist) throw error(404, 'Playlist not found');
	return { playlist };
};
