import { error } from '@sveltejs/kit';
import { playlists } from '$lib/data/playlists';

export const load = ({ params }) => {
	const playlist = playlists.find((p) => p.slug === params.slug);
	if (!playlist) throw error(404, 'Playlist not found');
	return { playlist };
};
