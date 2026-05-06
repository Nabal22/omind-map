import { redirect } from '@sveltejs/kit';
import { artists } from '$lib/data/artists';

export const prerender = true;

export const entries = () => artists.map((a) => ({ id: a.id }));

export const load = ({ params }) => {
	const artist = artists.find((a) => a.id === params.id);
	if (!artist) throw redirect(307, '/artists');
	return { artist };
};
