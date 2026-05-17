import { playlists } from '$lib/data/playlists';

export const prerender = true;

export const load = () => ({ playlists });
